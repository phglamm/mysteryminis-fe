/* eslint-disable react/prop-types */
import { SearchOutlined } from "@ant-design/icons";
import { Input, Dropdown, Menu } from "antd";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";

const Search = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { data: boxes = [] } = useSelector((state) => state.boxes); // Ensure boxes is an array
  const navigate = useNavigate();
  // Filtering based on boxName and brandName
  const filteredBoxes = boxes.filter(
    (box) =>
      box.boxName.toLowerCase().includes(inputValue.toLowerCase()) ||
      box.brandName.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && filteredBoxes.length > 0) {
      // Navigate to the first matched item
      navigate(route.product, {
        state: { boxName: inputValue },
      });
    } else if (e.key === "Enter" && inputValue === null) {
      // Navigate to the search page
      navigate(route.product, {
        state: { boxName: null },
      });
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setIsHovered(true);
    }
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsHovered(false);
    }
  };

  // Dropdown menu items, show "Not Found Blindbox" if no matches
  const menu = (
    <Menu>
      {!inputValue ? (
        boxes.slice(0, 3).map((item, index) => (
          <Menu.Item
            onClick={() => {
              navigate(route.product, { state: { boxName: item.boxName } });
              setInputValue(item.boxName);
            }}
            key={index}
          >
            {item.boxName}
          </Menu.Item>
        ))
      ) : filteredBoxes.length > 0 ? (
        filteredBoxes.slice(0, 5).map((item, index) => (
          <Menu.Item
            key={index}
            onClick={() => {
              navigate(route.product, { state: { boxName: item.boxName } });
              setInputValue(item.boxName);
            }}
          >
            {item.boxName}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>Not Found Blindbox</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div>
      <Dropdown arrow placement="bottom" overlay={isHovered ? menu : <></>}>
        <motion.div
          onClick={() => setIsHovered(true)}
          onMouseLeave={() => !inputValue && setIsHovered(false)}
          initial={{ width: 40, height: 40 }}
          animate={
            isHovered ? { width: 200, height: 40 } : { width: 40, height: 40 }
          }
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 2,
          }}
          className="flex rounded-4xl border-1 text-center justify-center items-center"
        >
          {isHovered ? (
            <Input
              placeholder="Search"
              variant="borderless"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              autoFocus
              onKeyDown={handleEnterKey}
            />
          ) : (
            <SearchOutlined />
          )}
        </motion.div>
      </Dropdown>
    </div>
  );
};

export default Search;
