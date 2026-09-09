import React from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const OptionInputTile = ({
    isSelected,
    label,
    lable,
    onSelect
}) => {
    const textLabel = label || lable;

    const getColors = () => {
        if (isSelected) {
            return "text-white bg-primary border-primary shadow-sm";
        }
        return "text-slate-800 bg-slate-100/90 border-slate-200/80 hover:bg-slate-200/70";
    };

    return (
        <div>
            <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3 mb-3 border rounded-xl transition-all duration-150 text-left ${getColors()}`}
                onClick={onSelect}
            >
                {isSelected ? (
                    <MdRadioButtonChecked className='text-xl text-white flex-shrink-0' />
                ) : (
                    <MdRadioButtonUnchecked className='text-xl text-slate-400 flex-shrink-0' />
                )}
                <span className={`text-[13px] font-medium leading-5 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {textLabel}
                </span>
            </button>
        </div>
    );
};

export default OptionInputTile;