import { useState } from "react";
import Sidebar from "./SideBar/SideBar";
import MyProfile from "./MainContent/MyProfile";
import AddressBook from "./MainContent/ManageAddress/AddressBook";
import EarnedRewards from "./MainContent/EarnedRewards";
import MyOrders from "./MainContent/MyOrders";
import MyCoupons from "./MainContent/MyCoupons";
import { motion } from "framer-motion";

const UserProfile = () => {
    const [activeSection, setActiveSection] = useState("My Profile");
    const [isEditing, setIsEditing] = useState(false);
    const [resetPassword, setResetPassword] = useState(false);
    const [addAddress, setAddAddress] = useState(false);

    
    const renderSectionContent = () => {
        switch (activeSection) {
            case "My Profile":
                return <MyProfile isEditing={isEditing} setIsEditing={setIsEditing} resetPassword={resetPassword} setResetPassword={setResetPassword} />;
            case "Address Book":
                return <AddressBook isEditing={isEditing} setIsEditing={setIsEditing} addAddress={addAddress} setAddAddress={setAddAddress} />;
            case "Earned Rewards":
                return <EarnedRewards />;
            case "My Orders":
                return <MyOrders />;
            case "My Coupons":
                return <MyCoupons />;
            default:
                return null;
        }
    };

    return (
        <div className="pt-[8%] max-h-screen min-h-screen pl-[5%] pr-[5%]" style={{ userSelect: "none" }}>
            <div className="p-5">
                <div className="grid grid-cols-4">
                    {/* Sidebar Component */}
                    <div className=" pt-4 pr-4 pb-4 pl-2">
                        <Sidebar setActiveSection={setActiveSection} isEditing={isEditing} />
                    </div>
                    

                    {/* Main Content */}
                    <div className="col-span-3 pt-4 pr-4 pb-4 pl-2">
                        <div className="flex flex-row justify-between border-b-1 border-gray-200 pb-2 ">
                            <motion.span
                                key={activeSection}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}  
                                exit={{ opacity: 0, x: -10 }}  
                                transition={{ duration: 1, type: "spring", damping: 10 }}
                                className="text-2xl font-bold"
                            >
                                {activeSection}
                            </motion.span>
                            {(activeSection === "My Profile" || activeSection === "Address Book") && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, color: "black" }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9, color: "red" }} 
                                    className={"border-1 rounded min-w-[65px] items-center text-center p-1 text-sm cursor-pointer" }
                                    onClick={() => {
                                        if (activeSection === "My Profile") {
                                            if (resetPassword) {
                                                setResetPassword(false);
                                            } else if (isEditing) {
                                                setIsEditing(false);
                                            } else {
                                                setIsEditing(true);
                                            }
                                        } else if (activeSection === "Address Book") {
                                            if (addAddress) {
                                                setAddAddress(false);
                                            } else if (isEditing) {
                                                setIsEditing(false);
                                            } else {
                                                setAddAddress(true);
                                            }
                                        }
                                    }}
                                >
                                {
                                    activeSection === "My Profile" ?  isEditing || resetPassword ? "Back" : "Edit Profile"
                                    : activeSection === "Address Book" ? isEditing ? "Back" : addAddress ? "Back" : "Add Address"
                                    : null
                                }
                                   
                                </motion.span>
                            )}
                        </div>
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {renderSectionContent()}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;