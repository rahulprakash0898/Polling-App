import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const AuthInput = ({ value, onChange, label, type, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  console.log('AuthInput type:', type); // Debugging log

  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="input-box relative">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none pr-10" // Add padding for the icon
          value={value}
          onChange={(e) => onChange(e)}
        />
        {type === 'password' && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-primary cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthInput; 