import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import SideMenu from './SideMenu';

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    className="block lg:hidden text-slate-700 hover:text-black focus:outline-none"
                    onClick={() => setOpenSideMenu((prev) => !prev)}
                    aria-label="Toggle Menu"
                >
                    {openSideMenu ? (
                        <HiOutlineX className="text-2xl" />
                    ) : (
                        <HiOutlineMenu className="text-2xl" />
                    )}
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-primary bg-clip-text text-transparent">
                        Polling App
                    </h1>
                </div>
            </div>

            {openSideMenu && (
                <div className="fixed top-[65px] left-0 w-64 bg-white shadow-xl lg:hidden z-40">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default Navbar;