import React, { useCallback } from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
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
}) => {

    const {user, onUserVoted, toggleBookmarkId, onPollCreateOrDelete, onBookmarkToggle} = useContext(UserContext);
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
        user.bookmarkedPolls || []
    );    

    const [pollBookmarked, setPollBookmarked] = useState(isPollBookmarked);
    const [pollClosed, setPollClosed] = useState(isPollClosed || false);
    const [pollDeleted, setPollDeleted] = useState(false);


    // handle user input based on poll type 
    const handleInput = (value) => {
    if (type === "rating") 
        setRating(value);
       else if (type === "open-ended") setUserResponse(value);
       else setSelectedOptionIndex(value);
    };

    //Generates post data based on the poll type
    const getPostData = useCallback(() => {
        if(type === "open-ended"){
            return { responseText: userResponse, voterId: user._id };
        }
        if(type === "rating"){
            return { optionIndex: rating - 1, voterId: user._id}
        }
        return { optionIndex: selectedOptionIndex, voterId: user._id }
    }, [type, userResponse, rating, selectedOptionIndex, user]);  

    //Get Poll Details by Id
    const getPollDetail = async()=>{
        try{
            const response = await axiosInstance.get(
                API_PATHS.POLLS.GET_BY_ID(pollId)
            );

            if(response.data){
                const pollDetails = response.data
                setPollResult({
                    options: pollDetails.options || [],
                    voters: pollDetails.voters.length || 0,
                    responses: pollDetails.responses || [],
                })
            }
        } catch (error){
            console.error(error.response?.data?.message || "Error submitting vote")
        }
    }

    //Handle vote submission
    const handleVoteSubmit = async () => {
        try {
            const response = await axiosInstance.post(
                API_PATHS.POLLS.VOTE(pollId),
               getPostData()
            );
            getPollDetail()
            setIsVoteComplete(true);
            onUserVoted();
            toast.success("Vote submitted successfully");
        } catch (error) {
            console.error(error.response?.data?.message || "Error submitting vote");
        }
    };

//Toggle the bookmark status of a poll
const toggleBookmark = async () => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.POLLS.BOOKMARK(pollId)
    );

    // Toggle the local bookmark state
    toggleBookmarkId(pollId);
    setPollBookmarked((prev) => !prev);

    // Show toast
    toast.success(response.data.message);

    // Call the callback if the poll is unbookmarked
    if (response.data.message?.toLowerCase().includes("removed")) {
      onBookmarkToggle?.(pollId);
    }

  } catch (error) {
    console.error(error.response?.data?.message || "Error bookmarking poll");
  }
};


  //Close Poll
  const closePoll = async () =>{
    try{
        const response = await axiosInstance.post(API_PATHS.POLLS.CLOSE(pollId))

        if(response.data){
            setPollClosed(true)
            toast.success(response.data?.message || "Poll Closed Successfully!")
        }
    } catch (error){
        toast.error("Something went wrong. Please try again");
        console.log("Something went wrong. Please try again", error)
    }
  }
  
  //Delete Poll
  const deletePoll = async () => {
  try {
    const response = await axiosInstance.delete(API_PATHS.POLLS.DELETE(pollId));

    if (response.data) {
      setPollDeleted(true);
      onDelete?.(); // Notify parent
      toast.success(response.data?.message || "Poll Deleted Successfully!");
    }
  } catch (error) {
    toast.error("Something went wrong. Please try again");
    console.error("Something went wrong. Please try again", error);
  }
};

  return (
    !pollDeleted && <div className='bg-slate-100/50 my-5 p-5 rounded-lg border border-slate-100 mx-auto'>
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
    !! (userResponse || selectedOptionIndex >= 0 || rating)
    }
    onVoteSubmit={handleVoteSubmit}
    isBookmarked={pollBookmarked}
    toggleBookmark={toggleBookmark}
    isMyPoll={isMyPoll}
    pollClosed={pollClosed}
    onClosePoll={ closePoll }
    onDelete={ deletePoll }
   />

    </div>
    <div className='ml-14 mt-3'>
        <p className='text-[15px] text-black leading-8'>{question}</p>
        <div className='mt-4'>
        {isVoteComplete || isPollClosed ? (
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
    ) :(
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
}

export default PollCard