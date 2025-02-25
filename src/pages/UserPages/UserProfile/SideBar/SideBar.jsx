/* eslint-disable react/prop-types */
import {
  EnvironmentOutlined,
  GithubOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../../../../Redux/features/counterSlice";
import Cookies from "js-cookie";
import { route } from "../../../../routes";

const Sidebar = ({ setActiveSection }) => {
  const user = useSelector(selectUser)
  const navigate = useNavigate();
  const sections = [
    {
      icon: <ProfileOutlined />,
      title: "My Profile",
      description: "Manage your information",
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Address Book",
      description: "Manage your address",
    }
  ];
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("accessToken");
    navigate(route.login);
  };

  return (
    <div className="pl-4 pt-4 pb-4 pr-2">
      <div className="h-fit bg-gray-100 rounded-xl p-4">
        <div className="border-b-1 border-gray-300 pb-4">
          <motion.div
            className="flex justify-end font-light underline text-sm mb-4"
            initial={{ scale: 1, color: "black" }}
            whileTap={{ scale: 0.9, color: "red" }}
            whileHover={{ color: "red" }}
            onClick={() => handleLogout()}
          >
            Sign Out
          </motion.div>
          <div className="flex justify-center mb-2 text-5xl">
            {" "}
            <GithubOutlined />{" "}
          </div>
          <div className="flex justify-center text-2xl">{user.username}</div>
        </div>

        <div className="mt-4 font-extrabold pb-4">
          Mystery Minis Member
          <div className="grid grid-cols-2 mt-4">
            <div className="flex flex-col justify-center items-center text-center border-r-1 border-gray-500">
              <motion.div
                initial={{ scale: 1, color: "black" }}
                whileTap={{ scale: 0.9, color: "red" }}
                whileHover={{ scale: 1.1, color: "red" }}
                onClick={() => setActiveSection("My Orders")}
              >
                <div className="font-light text-lg">My</div>
                <div className="font-light text-lg">Orders</div>
              </motion.div>
            </div>
            <div className="flex flex-col justify-center text-center items-center">
              <motion.div
                initial={{ scale: 1, color: "black" }}
                whileTap={{ scale: 0.9, color: "red" }}
                whileHover={{ scale: 1.1, color: "red" }}
                onClick={() => setActiveSection("My Coupons")}
              >
                <div className="text-xl">50</div>
                <div className="font-light text-lg">Coupons</div>
              </motion.div>
            </div>
          </div>
        </div>

        <div>
          {sections.map((section, index) => (
            <div key={index} className="border-t-1 border-gray-300 pt-4">
              <motion.div
                initial={{ scale: 1, color: "black" }}
                whileTap={{ scale: 0.9, color: "red" }}
                whileHover={{ scale: 1.1, color: "red" }}
                className="flex gap-3 items-center mb-4 cursor-pointer"
                onClick={() => setActiveSection(section.title)}
              >
                <div className="text-2xl">{section.icon}</div>
                <div className="flex flex-col">
                  <div className="font-extrabold text-[0.9vw]">
                    {section.title}
                  </div>
                  <div className="text-[0.6vw]">{section.description}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
