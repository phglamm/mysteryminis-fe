/* eslint-disable react/prop-types */
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";

const OrderSteps = ({ order }) => {
  const statusOrder = [
    "PENDING",
    "PROCESSING",
    "SHIPPING",
    "ARRIVED",
    "CANCELED",
  ];

  const getCurrentStepIndex = (order) => {
    // Get the latest status from orderStatusDetail
    const latestStatus =
      order.orderStatusDetail[order.orderStatusDetail?.length - 1]?.orderStatus
        .orderStatusName;
    const latestIndex = statusOrder.indexOf(latestStatus);

    // If the latest status is 'ARRIVED', return the last step index
    return latestStatus === "ARRIVED" ? latestIndex : latestIndex + 1;
  };

  return (
    <Steps
      responsive
      current={getCurrentStepIndex(order)}
      items={(order.orderStatusDetail?.slice(-1)[0]?.orderStatus
        .orderStatusName === "CANCELED"
        ? ["PENDING", "PROCESSING", "SHIPPING", "ARRIVED", "CANCELED"]
        : ["PENDING", "PROCESSING", "SHIPPING", "ARRIVED"]
      ).map((status, index) => {
        const currentStep = getCurrentStepIndex(order);
        const isCurrent = index === currentStep;
        const isCompleted = index < currentStep;

        return {
          title: status,
          status:
            order.orderStatusDetail?.slice(-1)[0]?.orderStatus
              .orderStatusName === "CANCELED"
              ? "error"
              : isCompleted
              ? "finish"
              : isCurrent
              ? "process"
              : "wait",
          icon:
            isCurrent && !isCompleted ? (
              <LoadingOutlined /> // Show loading icon for current step
            ) : status === "PENDING" ? (
              <UserOutlined />
            ) : status === "PROCESSING" ? (
              <SolutionOutlined />
            ) : status === "SHIPPING" ? (
              <SolutionOutlined />
            ) : status === "ARRIVED" ? (
              <SolutionOutlined />
            ) : status === "CANCELED" ? (
              <SolutionOutlined />
            ) : (
              <SmileOutlined />
            ), // Default icon for "ARRIVED"
        };
      })}
    />
  );
};

export default OrderSteps;
