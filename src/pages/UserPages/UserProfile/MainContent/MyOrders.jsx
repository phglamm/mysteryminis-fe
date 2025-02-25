
import { useState } from 'react';
import OrderCategories from '../../../../components/OrderCategories/OrderCategories';

import OrderItems from '../../../../components/OrderItems/OrderItems';
const MyOrders = () => {
    const [selectedCategory, setSelectedCategory] = useState("All Orders");
    const [ViewDetails, setViewDetails] = useState(false);

    return (
        <div className='flex flex-row pt-5 h-screen pb-56 lg:pb-[25%]'>
            <OrderCategories 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
                ViewDetails={ViewDetails} 
            />
            
            <OrderItems 
                selectedCategory={selectedCategory} 
                setViewDetails={setViewDetails} 

                />
            
        </div>
    );
}

export default MyOrders;