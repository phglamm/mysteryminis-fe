import { SearchOutlined } from '@ant-design/icons';
import { Input, Dropdown, Menu } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Search = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Sample search results
  const searchResults = ['Yooki', 'Labubu', 'Babythree', 'Skullpanda'];

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

  // Filtered results based on input
  const filteredResults = searchResults.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Dropdown menu items, show "Not Found Blindbox" if no matches
  const menu = (
    <Menu>
      {filteredResults.length > 0 ? (
        filteredResults.map((item, index) => <Menu.Item key={index}>{item}</Menu.Item>)
      ) : (
        <Menu.Item disabled>Not Found Blindbox</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div>
      <Dropdown arrow placement='bottom' overlay={isHovered ? menu : <></>} >
        <motion.div
          onClick={() => setIsHovered(true)}
          onMouseLeave={() => !inputValue && setIsHovered(false)}
          initial={{ width: 40, height: 40 }}
          animate={isHovered ? { width: 200, height: 40 } : { width: 40, height: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 2 }}
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
