
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { motion } from 'framer-motion';

import { useState } from 'react';

const Search = () => {
  const [isHovered, setIsHovered] = useState(false);
return (
    <div>
        <motion.div
            onClick={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ width: 40, height: 40 }}
            animate={isHovered ? { width: 200, height: 40 } : { width: 40, height: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 , duration: 2}}
            className=' flex rounded-4xl border-1 text-center justify-center items-center'
        >
            {isHovered ? <Input placeholder="Search" variant="borderless" /> : <SearchOutlined />}
        </motion.div>
    </div>
)
}

export default Search