/* eslint-disable react/prop-types */
import {
  BookOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  IdcardOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../../../../Redux/features/counterSlice";
import Cookies from "js-cookie";
import { route } from "../../../../routes";
import { clearCart } from "../../../../Redux/features/cartSlice";

const Sidebar = ({ setActiveSection }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const sections = [
    {
      icon: <IdcardOutlined />,
      title: "My Profile",
      description: "Manage your information",
    },
    {
      icon: <BookOutlined />,
      title: "My Orders",
      description: "Manage your order",
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Address Book",
      description: "Manage your address",
    },
  ];

  if (user.roleId === 1) {
    sections.push({
      icon: <LaptopOutlined />,
      title: "Admin Page",
      description: "Manage your store",
    });
  }

  if (user.roleId === 2) {
    sections.push({
      icon: <LaptopOutlined />,
      title: "Staff Page",
      description: "Manage your Blog",
    });
  }
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("accessToken");
    dispatch(clearCart());
    navigate(route.login);
  };

  return (
    <div className="pl-4 pt-4 pb-4 pr-2">
      <div className="h-fit bg-gray-100 rounded-xl p-4">
        <div className="pb-4">
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

        <div className="  flex flex-col  font-extrabold ">
          <div className="py-[1%] flex justify-start">Mystery Minis Member</div>
        </div>

        <div>
          {sections.map((section, index) => (
            <div key={index} className="border-t-1 border-gray-300 pt-4">
              <motion.div
                initial={{ scale: 1, color: "black" }}
                whileTap={{ scale: 0.9, color: "red" }}
                whileHover={{ scale: 1.1, color: "red" }}
                className="flex gap-3 items-center mb-4 cursor-pointer"
                onClick={() => {
                  if (section.title === "Admin Page") {
                    navigate("/admin/order-management");
                  } else if (section.title === "Staff Page") {
                    navigate("/staff/account-management");
                  } else {
                    setActiveSection(section.title);
                  }
                }}
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
