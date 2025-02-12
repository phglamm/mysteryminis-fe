import { useState } from "react";
import Logo from "../../assets/images/Logo.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import Search from "./Search/Search";
import { UserOutlined } from "@ant-design/icons";

export default function Header() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Sample data for My Collection
  const myCollection = [
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
    borderRadius: "30px",
    padding: "10px",
  };

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className="fixed top-0 w-full bg-white z-50">
      <div className="grid grid-cols-2 pr-6 pl-8 shadow-2xl h-24 border-b-1 items-center justify-center border-b-gray-300">
        {/* Logo and other navigations */}
        <motion.div
          className="flex justify-between font-sans font-bold text-[1vw] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ userSelect: "none" }}
        >
          <img src={Logo} alt="Logo" className="w-24 h-fit" />

          {/* Other menu items */}
          {[
            "COLLECTION",
            "OUR BLINDBOX",
            "ONLINE BLINDBOX",
            "RATING",
            "BLOGS",
          ].map((item, index) => (
            <motion.span
              key={item}
              initial={initial}
              animate={animate}
              transition={{ delay: 0.5 + index * 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, color: "red" }}
                onMouseEnter={() => setIsHovered(true)}
                onClick={navigateToHome}
                whileTap={{ scale: 0.9 }}
              >
                {item}
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
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {" "}
            <Search />
          </motion.span>
          <motion.span
            onMouseEnter={() => setIsHovered(false)}
            whileHover={{ scale: 1.1, color: "red" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-l-1 border-l-gray-200 p-2"
          >
            {" "}
            <UserOutlined /> Phong Lam
          </motion.span>
          <motion.span initial={{ opacity: 0 }} animate={animate}>
            {" "}
            Search Bar
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {" "}
            Search Bar
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
            {myCollection.map((item, index) => (
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
