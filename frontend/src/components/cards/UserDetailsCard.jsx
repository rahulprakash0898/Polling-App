import React from 'react';
import CharAvatar from './CharAvatar';

const StatsInfo = ({ label, value }) => {
    return (
        <div className="text-center p-2 rounded-lg bg-slate-50 flex-1">
            <p className="font-bold text-gray-900 text-base">{value}</p>
            <p className="text-[11px] text-slate-600 mt-[2px]">{label}</p>
        </div>
    );
};

const UserDetailsCard = ({
    profileImageUrl,
    fullname,
    username,
    totalPollsVotes,
    totalPollsCreated,
    totalPollsBookmarked,
}) => {
    return (
        <div className="bg-white rounded-2xl mt-6 overflow-hidden border border-slate-200/80 shadow-sm sticky top-[80px]">
            <div className="w-full h-24 bg-gradient-to-r from-sky-400 to-primary flex justify-center relative">
                <div className="absolute -bottom-8 rounded-full overflow-hidden border-4 border-white shadow-md">
                    {profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            alt="Profile"
                            className="w-16 h-16 object-cover bg-slate-200"
                        />
                    ) : (
                        <CharAvatar
                            fullName={fullname || username || "User"}
                            width="w-16"
                            height="h-16"
                            style="text-lg bg-sky-200 text-sky-900 font-bold"
                        />
                    )}
                </div>
            </div>

            <div className="mt-10 px-5 pb-5">
                <div className="text-center pt-1">
                    <h5 className="text-base text-gray-900 font-semibold leading-5">{fullname || "User"}</h5>
                    <span className="text-[12px] font-medium text-slate-500">
                        @{username || "username"}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-2 my-5">
                    <StatsInfo label="Created" value={totalPollsCreated || 0} />
                    <StatsInfo label="Voted" value={totalPollsVotes || 0} />
                    <StatsInfo label="Saved" value={totalPollsBookmarked || 0} />
                </div>
            </div>
        </div>
    );
};

export default UserDetailsCard;