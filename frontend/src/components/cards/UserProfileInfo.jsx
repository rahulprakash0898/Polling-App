import React from 'react';
import CharAvatar from './CharAvatar';
import moment from 'moment';

const UserProfileInfo = ({
    imgUrl,
    fullName,
    username,
    createdAt,
}) => {
    return (
        <div className="flex items-center gap-3">
            {imgUrl ? (
                <img
                    src={imgUrl}
                    alt={fullName || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
            ) : (
                <CharAvatar
                    fullName={fullName || username || "User"}
                    style="text-[13px] bg-sky-100 text-sky-800"
                />
            )}

            <div>
                <p className="text-sm text-black font-medium leading-4">
                    {fullName || username || "Anonymous"}{" "}
                    {createdAt && (
                        <>
                            <span className="mx-1 text-slate-400">·</span>
                            <span className="text-[11px] font-normal text-slate-500">
                                {moment(createdAt).fromNow()}
                            </span>
                        </>
                    )}
                </p>
                {username && (
                    <span className="text-[12px] text-slate-500 leading-4">
                        @{username}
                    </span>
                )}
            </div>
        </div>
    );
};

export default UserProfileInfo;