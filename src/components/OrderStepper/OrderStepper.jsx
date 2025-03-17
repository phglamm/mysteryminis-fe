/* eslint-disable react/prop-types */
import { BookOutlined, CheckSquareOutlined, CloseSquareOutlined, HourglassOutlined, LoadingOutlined, SmileOutlined, TruckOutlined } from '@ant-design/icons';
import { Steps } from 'antd';

const OrderSteps = ({ order }) => {
    const statusOrder = ['Pending', 'Processing', 'Shipping', 'Arrived', 'Cancelled'];
    const getCurrentStepIndex = (order) => {
    
    
        // Get the latest status from orderStatusDetail
        const latestStatus = order.orderStatusDetailsSimple[order.orderStatusDetailsSimple.length - 1]?.statusName;
        const latestIndex = statusOrder.indexOf(latestStatus);
    
        // If the latest status is 'Arrived', return the last step index
        return latestStatus === 'Arrived' ? latestIndex : latestIndex + 1;
    };
    
    return (
        <Steps
            responsive
            
            current={getCurrentStepIndex(order)}
            items={ (order.orderStatusDetailsSimple?.slice(-1)[0]?.statusName === 'Cancelled' ? ['Pending', 'Processing', 'Shipping', 'Arrived', 'Cancelled'] : ['Pending', 'Processing', 'Shipping', 'Arrived'] ) .map((status, index) => {
                const currentStep = getCurrentStepIndex(order);
                const isCurrent = index === currentStep;
                const isCompleted = index < currentStep || (status === 'Arrived' && index === currentStep);

                return {
                    title: status,
                    status: (order.orderStatusDetailsSimple?.slice(-1)[0]?.statusName === 'Cancelled' ? 'error' : (isCompleted ? 'finish' : isCurrent ? 'process' : 'wait')),
                    icon: isCurrent && !isCompleted
                        ? <LoadingOutlined /> // Show loading icon for current step
                        : status === 'Pending' ? <HourglassOutlined />
                        : status === 'Processing' ? <BookOutlined /> 
                        : status === 'Shipping' ? <TruckOutlined />
                        : status === 'Arrived' ? <CheckSquareOutlined />
                        : status === 'Cancelled' ? <CloseSquareOutlined />
                        : <SmileOutlined />, // Default icon for "Arrived"
                };
            })}
        />
    );
};

export default OrderSteps;
