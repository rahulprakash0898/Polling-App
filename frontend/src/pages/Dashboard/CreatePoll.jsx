import React, { useContext, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import { POLL_TYPE } from '../../utils/data';
import OptionInput from '../../components/input/OptionInput';
import OptionImageSelector from '../../components/input/OptionImageSelector';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
  useUserAuth();
  const navigate = useNavigate();

  const { user, onPollCreateOrDelete } = useContext(UserContext);

  const [pollData, setPollData] = useState({
    question: "",
    type: "single-choice",
    options: [],
    imageOptions: [],
    error: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueChange = (key, value) => {
    setPollData((prev) => ({
      ...prev,
      [key]: value,
      error: "",
    }));
  };

  const clearData = () => {
    setPollData({
      question: "",
      type: "single-choice",
      options: [],
      imageOptions: [],
      error: "",
    });
  };

  const updateImageAndGetLink = async (imageOptions) => {
    const optionPromises = imageOptions.map(async (imageOption) => {
      try {
        const imgUploadRes = await uploadImage(imageOption.file);
        return imgUploadRes || "";
      } catch (err) {
        toast.error(`Error uploading image: ${imageOption.file.name}`);
        return "";
      }
    });

    const optionArr = await Promise.all(optionPromises);
    return optionArr.filter(url => url !== "");
  };

  const getOptions = async () => {
    switch (pollData.type) {
      case "single-choice":
        return pollData.options;

      case "image-based": {
        const options = await updateImageAndGetLink(pollData.imageOptions);
        return options;
      }

      default:
        return [];
    }
  };

  const handleCreatePoll = async () => {
    const { question, type, options, imageOptions } = pollData;

    if (!question.trim()) {
      handleValueChange("error", "Please enter a question.");
      return;
    }

    if (!type) {
      handleValueChange("error", "Please select a poll type.");
      return;
    }

    if (type === "single-choice" && options.length < 2) {
      handleValueChange("error", "Please add at least 2 options for single-choice polls.");
      return;
    }

    if (type === "image-based" && imageOptions.length < 2) {
      handleValueChange("error", "Please upload at least 2 image options.");
      return;
    }

    handleValueChange("error", "");
    setIsSubmitting(true);

    try {
      const optionData = await getOptions();

      const response = await axiosInstance.post(API_PATHS.POLLS.CREATE, {
        question: question.trim(),
        type,
        options: optionData,
        creatorId: user?._id,
      });

      if (response.data) {
        toast.success("Poll created successfully!");
        onPollCreateOrDelete?.();
        clearData();
        navigate("/my-polls");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create poll. Please try again.";
      toast.error(errorMsg);
      handleValueChange("error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Create Poll">
      <div className="bg-white my-6 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create a New Poll</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a format, configure options, and engage your community.
            </p>
          </div>
          <span className="text-2xl">✨</span>
        </div>

        {/* Question Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Poll Question / Prompt *
          </label>
          <textarea
            placeholder="e.g. Which programming framework do you prefer for full-stack apps in 2026?"
            className="w-full text-[14px] text-gray-900 outline-none bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white transition-all p-3.5 rounded-xl resize-none leading-relaxed"
            rows={3}
            value={pollData.question}
            onChange={({ target }) => handleValueChange("question", target.value)}
          />
        </div>

        {/* Poll Type Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Poll Type *
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {POLL_TYPE.map((item) => {
              const isSelected = pollData.type === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70"
                  }`}
                  onClick={() => handleValueChange("type", item.value)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Type Specific Option Inputs */}
        {pollData.type === 'single-choice' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Poll Choices (2 - 4 Options)
            </label>
            <OptionInput
              optionList={pollData.options}
              setOptionList={(value) => handleValueChange("options", value)}
            />
          </div>
        )}

        {pollData.type === 'image-based' && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Image Options (2 - 4 Images)
            </label>
            <OptionImageSelector
              imageList={pollData.imageOptions}
              setImageList={(value) => handleValueChange("imageOptions", value)}
            />
          </div>
        )}

        {pollData.type === 'yes/no' && (
          <div className="mb-6 p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700 text-xs leading-relaxed">
            <p className="font-semibold text-sky-900 mb-1">👍 Yes / 👎 No Poll Format</p>
            <p>Voters will be presented with simple <strong>Yes</strong> and <strong>No</strong> voting buttons. Options will be generated automatically upon publishing.</p>
          </div>
        )}

        {pollData.type === 'open-ended' && (
          <div className="mb-6 p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-slate-700 text-xs leading-relaxed">
            <p className="font-semibold text-purple-900 mb-1">✍️ Open-Ended Feedback Format</p>
            <p>Voters will receive a text input box to write custom paragraph responses. All submitted answers with user profiles will be viewable in real-time.</p>
          </div>
        )}

        {pollData.type === 'rating' && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-slate-700 text-xs leading-relaxed">
            <p className="font-semibold text-amber-900 mb-1">⭐ 5-Star Rating Format</p>
            <p>Voters can rate your prompt from 1 to 5 stars. Star breakdown metrics will be aggregated automatically.</p>
          </div>
        )}

        {/* Error message */}
        {pollData.error && (
          <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
            {pollData.error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="button"
          disabled={isSubmitting}
          className="w-full btn-primary py-3 rounded-xl font-semibold shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          onClick={handleCreatePoll}
        >
          {isSubmitting ? (
            <span>Publishing Poll...</span>
          ) : (
            <span>🚀 Publish Poll</span>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CreatePoll;