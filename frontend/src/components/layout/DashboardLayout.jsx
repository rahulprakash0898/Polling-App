import React, { useContext } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import UserDetailsCard from "../cards/UserDetailsCard";
import { UserContext } from "../../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar activeMenu={activeMenu} />
            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className="grow mx-4 md:mx-6">{children}</div>
                    <div className="hidden lg:block w-80 mr-6">
                        <UserDetailsCard
                            profileImageUrl={user?.profileImageUrl}
                            fullname={user?.fullName || user?.fullname}
                            username={user?.username}
                            totalPollsVotes={user?.totalPollsVotes}
                            totalPollsCreated={user?.totalPollsCreated}
                            totalPollsBookmarked={user?.totalPollsBookmarked}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;