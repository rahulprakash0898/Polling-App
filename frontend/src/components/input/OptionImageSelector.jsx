import React from 'react';
import { HiOutlineTrash, HiMiniPlus } from "react-icons/hi2";

const OptionImageSelector = ({ imageList, setImageList }) => {
    // Function to handle adding an image
    const handleAddImage = (event) => {
        const file = event.target.files[0];
        if (file && imageList.length < 4) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageList([
                    ...imageList,
                    { base64: reader.result, file }
                ]);
            };
            reader.readAsDataURL(file);
            event.target.value = null;
        }
    };

    // Function to handle deleting an image 
    const handleDeleteImage = (index) => {
        const updatedList = imageList.filter((_, idx) => idx !== index);
        setImageList(updatedList);
    };

    return (
        <div>
            {imageList?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {imageList.map((item, index) => (
                        <div key={index} className="bg-slate-100 rounded-xl relative border border-slate-200 overflow-hidden">
                            <img
                                src={item.base64}
                                alt={`Selected Option ${index + 1}`}
                                className="w-full h-36 object-cover rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteImage(index)}
                                className="text-red-500 bg-white/90 hover:bg-white shadow-md rounded-full p-2 absolute top-2 right-2 transition-all"
                                title="Remove Image"
                            >
                                <HiOutlineTrash className="text-base" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {imageList.length < 4 && (
                <div className="flex items-center gap-3">
                    <input
                        type='file'
                        accept='image/jpeg, image/png, image/webp'
                        onChange={handleAddImage}
                        className="hidden"
                        id='imageInput'
                    />
                    <label htmlFor='imageInput' className='btn-small py-2 px-4 cursor-pointer inline-flex items-center gap-2'>
                        <HiMiniPlus className="text-lg" />
                        <span>Upload Image Option ({imageList.length}/4)</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default OptionImageSelector;