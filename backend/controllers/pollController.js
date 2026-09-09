const User = require("../models/User");
const Poll = require("../models/Poll");

// Create New Poll
exports.createPoll = async (req, res) => {
    const { question, type, options, creatorId } = req.body;

    const userCreatorId = creatorId || req.user?._id;

    if (!question || !type || !userCreatorId) {
        return res
            .status(400)
            .json({ message: "Question, type and creator are required." });
    }

    try {
        let processedOptions = [];
        switch (type) {
            case "single-choice":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Single-choice poll must have at least two options."
                    });
                }
                processedOptions = options.map((option) => ({ optionText: option }));
                break;

            case "rating":
                processedOptions = [1, 2, 3, 4, 5].map((value) => ({
                    optionText: value.toString()
                }));
                break;

            case "yes/no":
                processedOptions = ["Yes", "No"].map((option) => ({
                    optionText: option
                }));
                break;

            case "image-based":
                if (!options || options.length < 2) {
                    return res.status(400).json({
                        message: "Image-based poll must have at least two image options."
                    });
                }
                processedOptions = options.map((url) => ({ optionText: url }));
                break;

            case "open-ended":
                processedOptions = [];
                break;

            default:
                return res.status(400).json({ message: "Invalid poll type." });
        }

        const newPoll = await Poll.create({
            question,
            type,
            options: processedOptions,
            creator: userCreatorId
        });

        res.status(201).json(newPoll);
    } catch (err) {
        res.status(500).json({ message: "Error creating poll", error: err.message });
    }
};

// Get All Polls
exports.getAllPolls = async (req, res) => {
    const { type, creatorId, page = 1, pages, limit = 10 } = req.query;
    const filter = {};
    const userId = req.user?._id;

    if (type) filter.type = type;
    if (creatorId) filter.creator = creatorId;

    try {
        // Support both page and pages query params for backward compatibility
        const targetPage = page || pages || 1;
        const pageNumber = parseInt(targetPage, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        // Fetch polls with pagination
        const polls = await Poll.find(filter)
            .populate("creator", "fullName username email profileImageUrl")
            .populate({
                path: "response.voterId",
                select: "username profileImageUrl fullName"
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        // Add `userHasVoted` flag for each poll
        const updatedPolls = polls.map((poll) => {
            const userHasVoted = userId
                ? poll.voters.some((voterId) => voterId.equals(userId))
                : false;
            return {
                ...poll.toObject(),
                userHasVoted
            };
        });

        // Get total count of polls for pagination metadata
        const totalPolls = await Poll.countDocuments(filter);

        const stats = await Poll.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    type: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        // Ensure all types are included in stats, even those with zero counts
        const allTypes = [
            { type: "single-choice", label: "Single Choice" },
            { type: "yes/no", label: "Yes/No" },
            { type: "rating", label: "Rating" },
            { type: "image-based", label: "Image Based" },
            { type: "open-ended", label: "Open Ended" }
        ];

        const statsWithDefaults = allTypes
            .map((pollType) => {
                const stat = stats.find((item) => item.type === pollType.type);
                return {
                    label: pollType.label,
                    type: pollType.type,
                    count: stat ? stat.count : 0
                };
            })
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalPolls / pageSize),
            totalPolls,
            stats: statsWithDefaults
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching polls", error: err.message });
    }
};

// Get All Voted Polls
exports.getVotedPolls = async (req, res) => {
    const { page = 1, pages, limit = 10 } = req.query;
    const userId = req.user._id;

    try {
        const targetPage = page || pages || 1;
        const pageNumber = parseInt(targetPage, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        // Fetch polls where the user has voted
        const polls = await Poll.find({ voters: userId })
            .populate("creator", "fullName profileImageUrl username email")
            .populate({
                path: "response.voterId",
                select: "username profileImageUrl fullName"
            })
            .skip(skip)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        const updatedPolls = polls.map((poll) => {
            const userHasVoted = poll.voters.some((voterId) =>
                voterId.equals(userId)
            );
            return {
                ...poll.toObject(),
                userHasVoted
            };
        });

        const totalVotedPolls = await Poll.countDocuments({ voters: userId });

        res.status(200).json({
            polls: updatedPolls,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalVotedPolls / pageSize),
            totalVotedPolls
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching voted polls", error: err.message });
    }
};

// Get Poll by ID
exports.getPollById = async (req, res) => {
    const { id } = req.params;
    try {
        const poll = await Poll.findById(id)
            .populate("creator", "fullName username email profileImageUrl")
            .populate({
                path: "response.voterId",
                select: "username profileImageUrl fullName"
            });

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        res.status(200).json(poll);
    } catch (err) {
        res.status(500).json({ message: "Error fetching poll details", error: err.message });
    }
};

// Vote on Poll
exports.voteOnPoll = async (req, res) => {
    const { id } = req.params;
    const { optionIndex, voterId, responseText } = req.body;
    const effectiveVoterId = voterId || req.user?._id;

    try {
        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.closed) {
            return res.status(400).json({ message: "Poll is closed." });
        }

        if (poll.voters.some(v => v.toString() === effectiveVoterId.toString())) {
            return res
                .status(400)
                .json({ message: "User has already voted on this poll." });
        }

        if (poll.type === "open-ended") {
            if (!responseText || !responseText.trim()) {
                return res
                    .status(400)
                    .json({ message: "Response text is required for open-ended polls." });
            }
            poll.response.push({ voterId: effectiveVoterId, responseText: responseText.trim() });
        } else {
            if (
                optionIndex === undefined ||
                optionIndex < 0 ||
                optionIndex >= poll.options.length
            ) {
                return res.status(400).json({ message: "Invalid option index." });
            }
            poll.options[optionIndex].votes += 1;
        }

        poll.voters.push(effectiveVoterId);
        await poll.save();

        const updatedPoll = await Poll.findById(id)
            .populate("creator", "fullName username email profileImageUrl")
            .populate({
                path: "response.voterId",
                select: "username profileImageUrl fullName"
            });

        res.status(200).json(updatedPoll);
    } catch (err) {
        res.status(500).json({ message: "Error submitting vote", error: err.message });
    }
};

// Close Poll
exports.closePoll = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.creator.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ message: "You are not authorized to close this poll" });
        }

        poll.closed = true;
        await poll.save();

        res.status(200).json({ message: "Poll closed successfully", poll });
    } catch (err) {
        res.status(500).json({ message: "Error closing poll", error: err.message });
    }
};

// Bookmark Poll
exports.bookmarkPoll = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookmarked = user.bookmarkedPolls.some(
            (pollId) => pollId.toString() === id.toString()
        );

        if (isBookmarked) {
            user.bookmarkedPolls = user.bookmarkedPolls.filter(
                (pollId) => pollId.toString() !== id.toString()
            );
            await user.save();

            const updatedUser = await User.findById(userId).populate({
                path: "bookmarkedPolls",
                populate: [
                    { path: "creator", select: "fullName username profileImageUrl" },
                    { path: "response.voterId", select: "fullName username profileImageUrl" }
                ]
            });

            return res.status(200).json({
                message: "Poll removed from bookmarks",
                bookmarkedPolls: updatedUser.bookmarkedPolls
            });
        }

        user.bookmarkedPolls.push(id);
        await user.save();

        const updatedUser = await User.findById(userId).populate({
            path: "bookmarkedPolls",
            populate: [
                { path: "creator", select: "fullName username profileImageUrl" },
                { path: "response.voterId", select: "fullName username profileImageUrl" }
            ]
        });

        res.status(200).json({
            message: "Poll bookmarked successfully",
            bookmarkedPolls: updatedUser.bookmarkedPolls
        });
    } catch (err) {
        res.status(500).json({ message: "Error updating bookmarks", error: err.message });
    }
};

// Get All Bookmarked Polls
exports.getBookmarkedPolls = async (req, res) => {
    const userId = req.user.id || req.user._id;

    try {
        const user = await User.findById(userId).populate({
            path: "bookmarkedPolls",
            populate: [
                { path: "creator", select: "fullName username profileImageUrl" },
                { path: "response.voterId", select: "fullName username profileImageUrl" }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const bookmarkedPolls = user.bookmarkedPolls || [];

        // Add 'userHasVoted' flag for each poll
        const updatedPolls = bookmarkedPolls.map((poll) => {
            const userHasVoted = poll.voters
                ? poll.voters.some((voterId) => voterId.toString() === userId.toString())
                : false;
            return {
                ...poll.toObject(),
                userHasVoted
            };
        });

        return res.status(200).json({ bookmarkedPolls: updatedPolls });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookmarked polls", error: err.message });
    }
};

// Delete Poll
exports.deletePoll = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id || req.user._id;

    try {
        const poll = await Poll.findById(id);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.creator.toString() !== userId.toString()) {
            return res
                .status(403)
                .json({ message: "You are not authorized to delete this poll" });
        }

        await Poll.findByIdAndDelete(id);

        res.status(200).json({ message: "Poll deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting poll", error: err.message });
    }
};