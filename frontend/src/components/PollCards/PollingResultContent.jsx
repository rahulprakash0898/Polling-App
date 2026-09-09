import React from 'react';
import CharAvatar from '../cards/CharAvatar';
import moment from "moment";

const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  const progress = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

  return (
    <div className='w-full bg-slate-100 rounded-lg h-9 relative mb-3 overflow-hidden border border-slate-200'>
      <div
        className='bg-sky-500/20 h-full rounded-lg transition-all duration-500 ease-out'
        style={{ width: `${progress}%` }}
      />
      <span className='absolute inset-0 flex items-center justify-between text-gray-800 text-[13px] font-medium px-4'>
        <span>{label}</span>
        <span className='text-[12px] font-semibold text-primary'>{progress}% <span className='text-[11px] text-slate-500 font-normal'>({optionVotes} {optionVotes === 1 ? 'vote' : 'votes'})</span></span>
      </span>
    </div>
  );
};

const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
      <div className='w-full bg-slate-100 flex items-center justify-center mb-3 rounded-lg overflow-hidden h-40'>
        <img src={imgUrl} alt='' className='w-full h-full object-cover rounded-lg' />
      </div>
      <PollOptionVoteResult label="Option" optionVotes={optionVotes} totalVotes={totalVotes} />
    </div>
  );
};

const OpenEndedPollResponse = ({ profileImgUrl, userFullName, response, createdAt }) => {
  return (
    <div className='mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60'>
      <div className='flex items-center gap-3'>
        {profileImgUrl ? (
          <img src={profileImgUrl} alt='' className='w-8 h-8 rounded-full object-cover border border-slate-200' />
        ) : (
          <CharAvatar
            fullName={userFullName || "Anonymous"}
            style='w-8 h-8 text-[11px] bg-sky-100 text-sky-800'
          />
        )}

        <div>
          <p className='text-[13px] text-gray-900 font-medium leading-4'>
            {userFullName || "Anonymous"}
            {createdAt && (
              <>
                <span className='mx-1.5 text-slate-400'>·</span>
                <span className='text-[11px] font-normal text-slate-500'>{createdAt}</span>
              </>
            )}
          </p>
        </div>
      </div>
      <p className='text-[13px] text-slate-700 mt-2 pl-11 leading-relaxed'>{response}</p>
    </div>
  );
};

const PollingResultContent = ({ type, options, voters, responses }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <div className="space-y-1">
          {options?.map((option, idx) => (
            <PollOptionVoteResult
              key={option._id || `opt_${idx}`}
              label={`${option.optionText} ${type === "rating" ? "★" : ""}`}
              optionVotes={option.votes || 0}
              totalVotes={voters || 0}
            />
          ))}
        </div>
      );

    case "image-based":
      return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {options?.map((option, idx) => (
            <ImagePollResult
              key={option._id || `img_opt_${idx}`}
              imgUrl={option.optionText || ""}
              optionVotes={option.votes || 0}
              totalVotes={voters || 0}
            />
          ))}
        </div>
      );

    case "open-ended":
      if (!responses || responses.length === 0) {
        return (
          <p className="text-xs text-slate-500 italic py-2">
            No text responses submitted yet.
          </p>
        );
      }
      return (
        <div className="space-y-2 mt-2">
          {responses.map((resp, idx) => (
            <OpenEndedPollResponse
              key={resp._id || `resp_${idx}`}
              profileImgUrl={resp.voterId?.profileImageUrl}
              userFullName={resp.voterId?.fullName || resp.voterId?.username}
              response={resp.responseText || ""}
              createdAt={
                resp.createdAt ? moment(resp.createdAt).fromNow() : ""
              }
            />
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default PollingResultContent;