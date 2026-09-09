import React, { useCallback, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { getPollBookmarked } from '../../utils/helper.js';
import UserProfileInfo from '../cards/UserProfileInfo.jsx';
import PollActions from './PollActions.jsx';
import PollContent from './PollContent.jsx';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import toast from 'react-hot-toast';
import PollingResultContent from './PollingResultContent.jsx';

const PollCard = ({
  pollId,
  question,
  type,
  options,
  voters,
  responses,
  creatorProfileImg,
  creatorName,
  creatorUsername,
  userHasVoted,
  isMyPoll,
  isPollClosed,
  createdAt,
  onDelete,
  onBookmarkToggle,
}) => {
  const { user, onUserVoted, toggleBookmarkId } = useContext(UserContext);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [rating, setRating] = useState(0);
  const [userResponse, setUserResponse] = useState("");

  const [isVoteComplete, setIsVoteComplete] = useState(userHasVoted);

  const [pollResult, setPollResult] = useState({
    options,
    voters,
    responses,
  });

  const isPollBookmarked = getPollBookmarked(
    pollId,
    user?.bookmarkedPolls || []
  );

  const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
  const [pollClosed, setPollClosed] = useState(isPollClosed || false);
  const [pollDeleted, setPollDeleted] = useState(false);

  // Handle user input based on poll type 
  const handleInput = (value) => {
    if (type === "rating") setRating(value);
    else if (type === "open-ended") setUserResponse(value);
    else setSelectedOptionIndex(value);
  };

  // Generates post data based on the poll type
  const getPostData = useCallback(() => {
    if (type === "open-ended") {
      return { responseText: userResponse, voterId: user?._id };
    }
    if (type === "rating") {
      return { optionIndex: rating - 1, voterId: user?._id };
    }
    return { optionIndex: selectedOptionIndex, voterId: user?._id };
  }, [type, userResponse, rating, selectedOptionIndex, user]);

  // Get Poll Details by Id
  const getPollDetail = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POLLS.GET_BY_ID(pollId)
      );

      if (response.data) {
        const pollDetails = response.data;
        setPollResult({
          options: pollDetails.options || [],
          voters: pollDetails.voters?.length || 0,
          responses: pollDetails.response || pollDetails.responses || [],
        });
      }
    } catch (error) {
      // Handled silently
    }
  };

  // Handle vote submission
  const handleVoteSubmit = async () => {
    try {
      await axiosInstance.post(
        API_PATHS.POLLS.VOTE(pollId),
        getPostData()
      );
      getPollDetail();
      setIsVoteComplete(true);
      onUserVoted();
      toast.success("Vote submitted successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Error submitting vote";
      toast.error(msg);
    }
  };

  // Toggle the bookmark status of a poll
  const toggleBookmark = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.POLLS.BOOKMARK(pollId)
      );

      toggleBookmarkId(pollId);
      setPollBookmarked((prev) => !prev);
      toast.success(response.data.message);

      if (response.data.message?.toLowerCase().includes("removed")) {
        onBookmarkToggle?.(pollId);
      }
    } catch (error) {
      toast.error("Error updating bookmark");
    }
  };

  // Close Poll
  const closePoll = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId));

      if (response.data) {
        setPollClosed(true);
        toast.success(response.data?.message || "Poll Closed Successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again");
    }
  };

  // Delete Poll
  const deletePoll = async () => {
    try {
      const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId));

      if (response.data) {
        setPollDeleted(true);
        onDelete?.();
        toast.success(response.data?.message || "Poll Deleted Successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again");
    }
  };

  if (pollDeleted) return null;

  return (
    <div className='bg-white my-4 p-5 rounded-2xl border border-slate-200/80 shadow-sm mx-auto'>
      <div className='flex items-start justify-between'>
        <UserProfileInfo
          imgUrl={creatorProfileImg}
          fullName={creatorName}
          username={creatorUsername}
          createdAt={createdAt}
        />

        <PollActions
          pollId={pollId}
          isVoteComplete={isVoteComplete}
          inputCaptured={
            !!(userResponse || selectedOptionIndex >= 0 || rating)
          }
          onVoteSubmit={handleVoteSubmit}
          isBookmarked={pollBookmarked}
          toggleBookmark={toggleBookmark}
          isMyPoll={isMyPoll}
          pollClosed={pollClosed}
          onClosePoll={closePoll}
          onDelete={deletePoll}
        />
      </div>
      <div className='mt-3 pl-1'>
        <p className='text-[15px] font-semibold text-gray-900 leading-6 mb-3'>{question}</p>
        <div className='mt-2'>
          {isVoteComplete || pollClosed ? (
            <PollingResultContent
              type={type}
              options={pollResult.options}
              voters={pollResult.voters}
              responses={pollResult.responses}
              isMyPoll={isMyPoll}
              pollClosed={pollClosed}
              onDelete={() => setPollDeleted(true)}
              onClose={() => setPollClosed(true)}
            />
          ) : (
            <PollContent
              type={type}
              options={options}
              selectedOptionIndex={selectedOptionIndex}
              onOptionSelect={handleInput}
              rating={rating}
              onRatingChange={handleInput}
              userResponse={userResponse}
              onUserResponseChange={handleInput}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PollCard;