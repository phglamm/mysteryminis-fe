import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div
    className="mt-30"
    style={{height:"50vh"}}
    >
    <Result
      status="success"
      title="Order Placed Successfully!"
      subTitle="Thank you for your purchase. Your order is being processed and will be delivered soon."
      extra={[
        <Button 
          type="primary" 
          style={{ backgroundColor: "#313857", borderColor: "#FFF1F2" }} 
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>,
        <Button 
          style={{ color: "#313857", borderColor: "#313857" }} 
          onClick={() => navigate("/orders")}
        >
          View Orders
        </Button>
      ]}
    />
    </div>
  );
};

export default OrderSuccessPage;
