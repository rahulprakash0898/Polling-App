import React, { useState } from 'react';
import { IoCloseOutline, IoFilterOutline } from 'react-icons/io5';
import { POLL_TYPE } from '../../utils/data';

const HeaderWithFilter = ({ title, filterType, setFilterType }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>

                <button
                    type="button"
                    className={`flex items-center gap-2 text-xs font-semibold text-white bg-primary px-4 py-2 transition-all ${
                        open ? "rounded-t-xl" : "rounded-xl"
                    }`}
                    onClick={() => {
                        if (filterType !== '') setFilterType('');
                        setOpen(!open);
                    }}
                >
                    {filterType !== "" ? (
                        <>
                            <IoCloseOutline className="text-base" />
                            Clear Filter
                        </>
                    ) : (
                        <>
                            <IoFilterOutline className="text-base" />
                            Filter Polls
                        </>
                    )}
                </button>
            </div>

            {open && (
                <div className='flex items-center gap-2 bg-primary p-3 rounded-b-xl rounded-tl-xl flex-wrap shadow-md shadow-sky-500/10'>
                    {[{ label: 'All Formats', value: '' }, ...POLL_TYPE].map((type) => (
                        <button
                            type="button"
                            key={type.value}
                            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                                filterType === type.value
                                    ? "text-white bg-sky-950 shadow-inner"
                                    : "text-sky-900 bg-sky-100 hover:bg-white"
                            }`}
                            onClick={() => setFilterType(type.value)}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeaderWithFilter;