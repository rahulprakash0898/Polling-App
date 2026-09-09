import React from 'react';

const EmptyCard = ({ imgSrc, imgsrc, message, btnText, onClick }) => {
  const image = imgSrc || imgsrc;
  return (
    <div className='bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center my-6 py-16 px-6 rounded-2xl'>
      {image && (
        <img src={image} alt='Empty' className='w-36 md:w-44 object-contain mb-4' />
      )}

      <p className='max-w-md text-xs md:text-[14px] font-medium text-slate-600 text-center leading-relaxed'>
        {message}
      </p>

      {btnText && (
        <button className='btn-small px-6 py-2.5 mt-6 font-semibold shadow-sm' onClick={onClick}>
          {btnText}
        </button>
      )}
    </div>
  );
};

export default EmptyCard;