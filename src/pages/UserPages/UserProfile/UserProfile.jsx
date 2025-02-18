import { useState } from "react";
import Sidebar from "./SideBar/SideBar";
import MyProfile from "./MainContent/MyProfile";
import AddressBook from "./MainContent/AddressBook";
import EarnedRewards from "./MainContent/EarnedRewards";
import MyOrders from "./MainContent/MyOrders";
import MyCoupons from "./MainContent/MyCoupons";


const UserProfile = () => {
    const [activeSection, setActiveSection] = useState("My Profile");

    const renderSectionContent = () => {
        switch (activeSection) {
            case "My Profile":
                return <MyProfile/> ;
            case "Address Book":
                return <AddressBook/>;
            case "Earned Rewards":
                return <EarnedRewards/>;
            case "My Orders":
                return <MyOrders/>;
            case "My Coupons":
                return <MyCoupons/>;
            default:
                return null;
        }
    };

    return (
        <div className="pt-24 max-h-screen min-h-screen pl-40 pr-40" style={{ userSelect: "none" }}>
            <div className="p-5">
                <div className="grid grid-cols-4">
                    {/* Sidebar Component */}
                    <Sidebar setActiveSection={setActiveSection} />

                    {/* Main Content */}
                    <div className="col-span-3 pt-4 pr-4 pb-4 pl-2">
                        <div className="text-2xl font-bold border-b-1 border-gray-200 pb-4 ">{activeSection}</div>
                        {renderSectionContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
