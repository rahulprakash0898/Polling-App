import React from 'react';
import UI_ELEMENT from '../../assets/images/ui-element.jpg';
import CARD_1 from '../../assets/images/auth-card-1.png';
import CARD_2 from '../../assets/images/auth-card-2.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 px-8 sm:px-12 pt-8 pb-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-primary bg-clip-text text-transparent">
              Polling App
            </h2>
          </div>
        </div>
        <div className="my-auto">{children}</div>
        <div className="text-xs text-slate-400">
          Developed by Rahul Prakash &bull; Polling App
        </div>
      </div>

      {/* Right Section with Background and Cards */}
      <div
        className="hidden md:block w-1/2 min-h-screen bg-cover bg-center relative overflow-hidden bg-slate-900"
        style={{
          backgroundImage: `url(${UI_ELEMENT})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />

        {/* Card 1 */}
        <img
          src={CARD_1}
          className="w-64 lg:w-80 absolute top-[12%] left-[10%] shadow-2xl shadow-cyan-500/20 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105"
          alt="Poll Card 1"
        />

        {/* Card 2 */}
        <img
          src={CARD_2}
          className="w-64 lg:w-80 absolute bottom-[10%] right-[10%] shadow-2xl shadow-sky-500/20 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105"
          alt="Poll Card 2"
        />
      </div>
    </div>
  );
};

export default AuthLayout;