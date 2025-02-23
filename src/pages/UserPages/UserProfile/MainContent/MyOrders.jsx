
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../../../../config/api';
// import { useSelector } from 'react-redux';
// import { selectUser } from '../../../../Redux/features/counterSlice';
import OrderCategories from '../../../../components/OrderCategories/OrderCategories';
import OrderSteps from '../../../../components/OrderStepper/OrderStepper';
const MyOrders = () => {
    const [selectedCategory, setSelectedCategory] = useState("All Orders");
    const [ViewDetails, setViewDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    // const user = useSelector(selectUser);

  
   const fetchOrders = async () => {
        try {
            const response = await api.get('Order?userId=92');
            setOrders(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    const formatDate = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(',', '');
    };

    


    return (
        <div className='flex flex-row pt-5 h-screen pb-52'>
            <OrderCategories 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
                ViewDetails={ViewDetails} 
            />

            {/* {Order Items} */}
            <motion.div 
                className={`overflow-y-scroll flex flex-col  `}
                initial={{ width: '75%' }}
                animate={{ width: ViewDetails ? '100%' : '75%' }}
                transition={ViewDetails ? {duration: 0.3, delay: 0.8 } : { }}
            >
                {(ViewDetails && selectedOrder ? [selectedOrder] : orders).map((order, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: "spring", damping: 10, delay: index * 0.2 }}
                        className="w-full h-fit flex flex-col border-1 border-gray-300 mb-4"
                    >  
                        <div className='grid grid-cols-5  items-center p-4 bg-gray-100'>
                            <div className='flex col-span-4 w-full gap-4 justify-start'>
                                <div>Order Number: {order.orderId}</div>
                                <div>Order Date: {formatDate(order.orderCreatedAt)}</div>
                            </div>

                            <div className='flex w-full justify-end'>
                                { ViewDetails ? (
                                    <motion.button
                                        className='border-1 px-3 py-1 w-[70%] rounded-md text-center font-bold'
                                        initial={{ backgroundColor: '#f3f4f6', color: 'black', opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 1.3 }}
                                        whileHover={{scale: 1.1 ,backgroundColor: '#ef4444', color: 'white' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            setSelectedOrder(null); // Reset selected order
                                            setViewDetails(false);
                                        }}
                                    >
                                        Back
                                    </motion.button>
                                ) : (
                                    <div>{order.orderStatusDetailsSimple?.slice(-1)[0]?.statusName || 'Pending'}</div>
                                )
                            }
                            </div>
                        </div>
                        

                        <div className='p-4 h-fit pb-24'>
                        
                                <motion.div
                                    initial={{ opacity: 0, y: -50, height: 0 }} 
                                    animate={ViewDetails ? { opacity: 1, y: 0, height: "20%" } : { opacity: 0}}    
                                    transition={{ duration: 1, type: "spring", damping: 10 }}
                                    className={`items-center flex flex-col px-10 ${ViewDetails ? "" : "hidden"}`}
                                >

                                <OrderSteps order={order} />


                                    <div className='flex w-full flex-row gap-32'>
                                        {order.orderItems.length > 0 ? (order.orderStatusDetailsSimple.map((status, index) => (
                                            <div key={index} className=' w-[15%] text-gray-500 text-[80%] h-fit'> Updated At: {formatDate(status.updatedAt)}</div>
                                        ))
                                        ) : (
                                            <div></div>
                                        ) 
                                        }
                                    </div>
                                </motion.div>

                                <div className=' p-4 flex flex-col lg:flex-row h-48 border-y-1 border-dashed'>
                                    <span className=' flex flex-col w-[100%] lg:w-[30%]'>
                                        <span className='text-[2vw]'>Delivery Address</span>
                                        <span className='text-[1vw]'>Customer Name:</span>
                                        <span className='tetx-[0.5vw] text-gray-400'>Phone: </span>
                                        <span className='tetx-[0.5vw] text-gray-400'>Address: </span>
                                    </span>
                                    <span className='w-[100%] lg:w-[70%]'>
                                        .
                                    </span>
                                </div>
                            {order.orderItems.length > 0 > 0 ? (
                                (ViewDetails ? order.orderItems : order.orderItems.slice(0, 1)).map((item, itemIndex) => (
                                    <motion.div 
                                        key={itemIndex} 
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, type: "spring", damping: 10, delay: itemIndex * 0.2 }}
                                        className='flex border-b-1 pb-2 pt-8 border-gray-200 h-28'
                                    >
                                        <div className='flex gap-1 w-3/4'>
                                            <div className='w-1/4 bg-pink-200'>
                                                <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                                            </div>
                                            <div className='w-3/4 flex flex-col'>
                                                <span className='font-bold text-xl'>{item.name}</span>
                                                <span className='text-sm text-gray-300'>x{item.quantity}</span>
                                                <span className='text-sm text-red-500'>{item.openRequest ? 'Open Requested' : '' }</span>
                                            </div>
                                        </div>
                                        <div className='flex justify-center items-center w-1/4'>
                                            {ViewDetails ? (
                                                <div>{item.orderPrice}</div>
                                            ) : (
                                                <motion.button
                                                className='border-1 px-3 py-1 w-[80%] rounded-md font-bold'
                                                initial={{ backgroundColor: '#f3f4f6', color: 'black' }}
                                                whileHover={{scale: 1.1 ,backgroundColor: '#ef4444', color: 'white' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    setSelectedOrder(order); // Set the specific order to display
                                                    setViewDetails(true);
                                                }}
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
                                <div>Order Total: {order.totalPrice}</div>
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