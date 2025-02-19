import {motion} from 'framer-motion'

const MyOrders = () => {
const orders = [
    { orderNumber: '001', orderDate: '2023-01-01', numberOfItems: 3, price: '$30' },
    { orderNumber: '002', orderDate: '2023-02-01', numberOfItems: 5, price: '$50' },
    { orderNumber: '003', orderDate: '2023-03-01', numberOfItems: 2, price: '$20' },
    { orderNumber: '004', orderDate: '2023-04-01', numberOfItems: 4, price: '$40' },
    { orderNumber: '005', orderDate: '2023-05-01', numberOfItems: 1, price: '$10' }
];

return (
    <div className='pt-5  overflow-y-scroll h-[27vw]'>
        {orders.map((order, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, type: "spring", damping: 10, delay: index * 0.2 }}
                className="w-full h-40 flex flex-col border-1 border-gray-300 mb-4"
            >  
                <div className='flex justify-center items-center p-4 bg-gray-100'>
                    <div className='flex w-full gap-4 justify-start'>
                        <div>Order Number: {order.orderNumber}</div>
                        <div>Order Date: {order.orderDate}</div>
                    </div>
                    <div className='flex w-full gap-4 justify-end'>
                        <div>{order.numberOfItems} Items </div>
                        <div>Price: {order.price}</div>
                    </div>
                </div>
            </motion.div>
        ))}  
    </div>
);
}

export default MyOrders