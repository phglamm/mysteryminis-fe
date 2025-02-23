/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';

const OrderCategories = ({ selectedCategory, setSelectedCategory, ViewDetails }) => {
    const categories = [
        "All Orders", "Pending", "Processing", "Shipping", "Arrived", "Cancelled", "Return Refund"
    ];

    return (
        <motion.div
            initial={{ width: '25%' }}
            animate={{ width: ViewDetails ? '0%' : '25%' }}
            transition={ViewDetails ? { duration: 1, delay: 0.8 } : {}}
        >
            {categories.map((label, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1 }}
                    animate={ViewDetails ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className='text-center'
                >
                    <motion.button
                        className={`w-[70%] px-5 py-1 mt-2 font-bold rounded-full border-2 transition-all ${selectedCategory === label ? "bg-red-500 text-white" : "bg-white text-black"}`}
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedCategory(label)}
                    >
                        {label}
                    </motion.button>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default OrderCategories;
