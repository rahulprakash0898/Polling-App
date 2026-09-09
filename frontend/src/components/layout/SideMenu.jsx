import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const SideMenu = ({ activeMenu }) => {
    const { clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (item.label === 'Logout' || item.path === '/login') {
            handleLogout();
            return;
        }
        navigate(item.path);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    return (
        <div className="w-64 h-[calc(100vh-65px)] bg-slate-50/70 border-r border-slate-200/80 p-5 sticky top-[65px] z-20 flex flex-col justify-between">
            <div>
                {SIDE_MENU_DATA.map((item, index) => {
                    const isActive = activeMenu === item.label;
                    return (
                        <button
                            key={`menu_${index}`}
                            className={`w-full flex items-center gap-4 text-[14px] font-medium transition-all duration-200 py-3 px-5 rounded-xl mb-2 ${
                                isActive
                                    ? "text-white bg-primary shadow-md shadow-sky-500/20"
                                    : "text-slate-600 hover:bg-slate-200/60 hover:text-black"
                            }`}
                            onClick={() => handleClick(item)}
                        >
                            <item.icon className={`text-xl ${isActive ? "text-white" : "text-slate-500"}`} />
                            {item.label}
                        </button>
                    );
                })}
            </div>
            <div className="text-center text-[11px] text-slate-400 pb-2">
                Polling App &copy; {new Date().getFullYear()} Rahul Prakash
            </div>
        </div>
    );
};

export default SideMenu;