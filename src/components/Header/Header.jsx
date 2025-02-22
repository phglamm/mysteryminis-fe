import { useState } from "react";
import Logo from "../../assets/images/Logo-removebg.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Search from "../Search/Search";
import { useSelector } from "react-redux";
import { route } from "../../routes";
import { selectUser } from "../../Redux/features/counterSlice";

export default function Header() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const BlindBoxCategories = [
    { name: "Item 1" },
    { name: "Item 2" },
    { name: "Item 3" },
    { name: "Item 4" },
    { name: "Item 5" },
    { name: "Item 6" },
    { name: "Item 7" },
    { name: "Item 8" },
    { name: "Item 9" },
    { name: "Item 10" },
  ];

  const initial = {
    opacity: 0,
    padding: "10px",
  };

  const animate = {
    opacity: 1,
    padding: "10px",
  };

  const navigateToHome = () => {
    navigate("/");
  };

  // Define navigation links
  const navItems = [
    { label: "Online Blindbox", path: "/online-blindbox" },
    { label: "Rating", path: "/rating" },
    { label: "Blogs", path: "/blogs" },
  ];
  const user = useSelector(selectUser);
  return (
    <div className="fixed top-0 w-full z-50 bg-white">
      <div className="grid grid-cols-2 p-4 pr-6 pl-10 shadow-md h-fit border-b-1 items-center justify-center border-b-gray-300">
        {/* Logo and other navigations */}
        <motion.div
          className="flex justify-between font-sans font-bold text-[1vw] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ userSelect: "none" }}
        >
          <img src={Logo} alt="Logo" className="w-[15%] h-fit" />

          <motion.span
            initial={initial}
            animate={animate}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, color: "red" }}
              onMouseEnter={() => setIsHovered(true)}
              onClick={navigateToHome}
              whileTap={{ scale: 0.9 }}
            >
              Collection
            </motion.div>
          </motion.span>

          <motion.span
            initial={initial}
            animate={animate}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, color: "red" }}
              onMouseEnter={() => setIsHovered(true)}
              onClick={() => navigate(route.product)}
              whileTap={{ scale: 0.9 }}
            >
              Our Blindbox
            </motion.div>
          </motion.span>

          {/* Dynamic Navigation Links */}
          {navItems.map((item, index) => (
            <motion.span
              key={item.label}
              initial={initial}
              animate={animate}
              transition={{ delay: 1.2 + index * 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, color: "red" }}
                onMouseEnter={() => setIsHovered(false)}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
              >
                {item.label}
              </motion.div>
            </motion.span>
          ))}
        </motion.div>

        {/* Login and Register */}
        <motion.div
          className="flex gap-3 justify-end font-sans font-bold text-[1vw] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ userSelect: "none" }}
        >
          <motion.span
            whileTap={() => setIsHovered(false)}
            initial={{ opacity: 0 }}
            animate={animate}
            className="border-r-1 border-l-gray-100 p-2"
          >
            <Search />
          </motion.span>

          <motion.span
            onMouseEnter={() => setIsHovered(false)}
            whileHover={{ scale: 1.1, color: "red" }}
            whileTap={{ scale: 0.9, color: "black" }}
            initial={{ opacity: 0 }}
            animate={animate}
            onClick={() =>
              user ? navigate("/userProfile") : navigate(route.login)
            }
          >
            <UserOutlined /> {user ? user.username : "Sign In"}
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={animate}
            className="justify-between flex items-center gap-4 p-2"
          >
            <motion.span
              whileHover={{ scale: 1.1, color: "red" }}
              whileTap={{ scale: 0.9, color: "black" }}
            >
              <MessageOutlined className="text-2xl" />
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1, color: "red" }}
              whileTap={{ scale: 0.9, color: "black" }}
            >
              <HeartOutlined className="text-2xl" />
            </motion.span>
          </motion.span>

          <motion.span
            whileHover={{ scale: 1.1, color: "red" }}
            whileTap={{ scale: 0.9, color: "black" }}
            initial={{ opacity: 0 }}
            animate={animate}
            className="border-1 rounded-3xl text-xl w-[6vw] flex justify-center items-center"
          >
            <ShoppingCartOutlined />
          </motion.span>
        </motion.div>
      </div>

      {/* Animated Dropdown */}
      {isHovered && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center font-bold bg-gray-200 "
          style={{ userSelect: "none" }}
        >
          <div className="grid pr-64 pl-64 grid-cols-5 justify-center items-center gap-4 p-4 ">
            {BlindBoxCategories.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card bordered={false} className="shadow-md w-36">
                  {item.name}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
