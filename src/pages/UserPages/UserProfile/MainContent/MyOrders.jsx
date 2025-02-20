import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
const ShippingStatus = 'Pending'; 
const MyOrders = () => {
    const [selectedCategory, setSelectedCategory] = useState("All Orders");
    const [ViewDetails, setViewDetails] = useState(false);
    console.log(ViewDetails);
    const categories = [
        "All Orders", "Pending", "Processing", "Shipping", "Arrived", "Cancelled", "Return Refund"
    ];

   
    const orders = [
        { 
            orderNumber: '001', 
            orderDate: '2023-01-01', 
            numberOfItems: 3, 
            price: '$30',
            status: 'Pending',
            items: [
                { name: 'Item 1', quantity: 1, price: '$10', image: 'image1.jpg' },
                { name: 'Item 2', quantity: 1, price: '$10', image: 'image2.jpg' },
                { name: 'Item 2', quantity: 1, price: '$10', image: 'image2.jpg' }
            ]
        },
        { orderNumber: '002', orderDate: '2023-02-01', numberOfItems: 5, price: '$50', items: [] },
        { orderNumber: '003', orderDate: '2023-03-01', numberOfItems: 2, price: '$20', items: [] },
        { orderNumber: '004', orderDate: '2023-04-01', numberOfItems: 4, price: '$40', items: [] },
        { orderNumber: '005', orderDate: '2023-05-01', numberOfItems: 1, price: '$10', items: [] }
    ];

    return (
        <div className='flex flex-row pt-5 h-[27vw]'>
            <motion.div
                initial={{ width: '25%' }}
                animate={{ width: ViewDetails ? '0%' : '25%' }}
                transition={ViewDetails ? { duration: 1, delay: 0.8 } : {}}
            >
                {categories.map((label, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 1 }}
                        animate={ ViewDetails ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }  }
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

            <motion.div 
                className={`overflow-y-scroll flex flex-col  `}
                initial={{ width: '75%' }}
                animate={{ width: ViewDetails ? '100%' : '75%' }}
                transition={ViewDetails ? {duration: 0.3, delay: 0.8 } : { }}
            >
                {(ViewDetails ? orders.slice(0,1) : orders).map((order, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: "spring", damping: 10, delay: index * 0.2 }}
                        className="w-full h-fit flex flex-col border-1 border-gray-300 mb-4"
                    >  
                        <div className='flex justify-center items-center p-4 bg-gray-100'>
                            <div className='flex w-full gap-4 justify-start'>
                                <div>Order Number: {order.orderNumber}</div>
                                <div>Order Date: {order.orderDate}</div>
                            </div>

                            <div className='flex w-full justify-end'>
                                { ViewDetails ? (
                                    <motion.button
                                        className='border-1 px-3 py-1 w-[30%] rounded-md font-bold'
                                        initial={{ backgroundColor: '#f3f4f6', color: 'black', opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 1.3 }}
                                        whileHover={{scale: 1.1 ,backgroundColor: '#ef4444', color: 'white' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setViewDetails(!ViewDetails)}
                                    >
                                        Back
                                    </motion.button>
                                ) : (
                                    <div>{order.status}</div>
                                )

                                }
                                
                            </div>
                        </div>
                            
                        <div className='p-4 h-fit'>
                                <motion.div
                                    initial={{ opacity: 0, y: -50, height: 0 }} 
                                    animate={ViewDetails ? { opacity: 1, y: 0, height: "20%" } : { opacity: 0}}    
                                    transition={{ duration: 1, type: "spring", damping: 10 }}
                                    className={`p-4 px-12 ${ViewDetails ? "" : "hidden"}`}
                                >
                                    <Steps
                                        items={[
                                        {
                                            title: 'Pending',
                                            status: 'finish',
                                            icon: <UserOutlined />,                                                  
                                        },
                                        {
                                            title: 'Processing',
                                            status: 'finish',
                                            icon: <SolutionOutlined />,
                                        },
                                        {
                                            title: 'Shipping',
                                            status: 'process',
                                            icon: <LoadingOutlined />,
                                        },
                                        {
                                            title: 'Arrived',
                                            status: 'wait',
                                            icon: <SmileOutlined />,
                                        },
                                        ]}
                                    />
                                </motion.div>
                            {order.items.length > 0 ? (
                                (ViewDetails ? order.items : order.items.slice(0, 1)).map((item, itemIndex) => (
                                    <motion.div 
                                        key={itemIndex} 
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, type: "spring", damping: 10, delay: itemIndex * 0.2 }}
                                        className='flex border-b-1 pb-2 pt-2 border-gray-200 h-28'
                                    >
                                        <div className='flex gap-1 w-3/4'>
                                            <div className='w-1/4 bg-pink-200'>
                                                <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                            </div>
                                            <div className='w-3/4 flex flex-col'>
                                                <span className='font-bold text-xl'>{item.name}</span>
                                                <span className='text-sm text-gray-300'>x{item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className='flex justify-center items-center w-1/4'>
                                            {ViewDetails ? (
                                                <div>{item.price}</div>
                                            ) : (
                                                <motion.button
                                                className='border-1 px-3 py-1 w-[80%] rounded-md font-bold'
                                                initial={{ backgroundColor: '#f3f4f6', color: 'black' }}
                                                whileHover={{scale: 1.1 ,backgroundColor: '#ef4444', color: 'white' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setViewDetails(!ViewDetails)}
                                                >
                                                    See Details
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className='text-center text-gray-400'>No items in this order</div>
                            )}
                        </div>

                        <div className=' gap-4 px-8 p-2 bg-white h-fit border-dashed border-t-1'>
                            <div className='flex text-2xl w-full gap-4 py-4 justify-end'>
                                <div>Order Total: {order.price}</div>
                            </div>

                            <div className='flex justify-end gap-4'>
                                <motion.button
                                    className='border-1 px-3 py-1 w-[20%] rounded-md font-bold'
                                    initial={{ backgroundColor: '#ef4444', color:'white', border: '1px solid #f3f4f6' }}
                                    whileHover={{ backgroundColor: '#ef4444', color: 'white', border: '1px solid white', scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Rate
                                </motion.button>
                                <motion.button
                                    className='border-1 px-3 py-1 w-[40%] rounded-md font-bold'
                                    initial={{ border: '1px solid #f3f4f6' }}
                                    whileHover={{ backgroundColor: 'black', color: 'white', border: '1px solid white', scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Request for Return/Refund
                                </motion.button>
                            </div>
                            
                        </div>
                    </motion.div>
                ))}  
            </motion.div>
        </div>
    );
}

export default MyOrders;