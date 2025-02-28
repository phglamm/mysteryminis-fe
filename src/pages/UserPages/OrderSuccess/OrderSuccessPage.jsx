import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { route } from "../../../routes";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-30" style={{ height: "50vh" }}>
      <Result
        status="success"
        title="Order Placed Successfully!"
        subTitle="Thank you for your purchase. Your order is being processed and will be delivered soon."
        extra={[
          <Button
            key={1}
            type="primary"
            style={{ backgroundColor: "#313857", borderColor: "#FFF1F2" }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>,
          <Button
            key={2}
            style={{ color: "#313857", borderColor: "#313857" }}
            onClick={() => navigate(route.userProfile)}
          >
            View Orders
          </Button>,
        ]}
      />
    </div>
  );
};

export default OrderSuccessPage;
