/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import OrderSteps from "../OrderStepper/OrderStepper";
import toast from "react-hot-toast";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Image } from "antd";
import { cancelOrder, fetchOrders, requestRefund } from "../../services/UserServices/ManageOrderServices/ManageOrderServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/features/counterSlice";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
// import { FeedbackModal } from "../FeedbackModel/FeedbackModal";



const OrderItems = ({ selectedCategory, setViewDetails }) => {
  const [ViewDetails, setViewDetailsState] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checkCard, setCheckCard] = useState(null);
  const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState(null); // State lưu đơn hàng đang chọn để feedback


  const user = useSelector(selectUser);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders(user);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Expected an array but got:", data);
        setOrders([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Fallback to an empty array
    }
  };

  useEffect(() => {
    loadOrders();
  }, [selectedCategory]);

  useEffect(() => {
    setViewDetails(ViewDetails);
  }, [ViewDetails]);

  const handleCancelOrder = async (orderId) => {
    setLoadingCancel(true);
    try {
      await cancelOrder(orderId);
      toast.success("Order has been cancelled");
      loadOrders();
      setViewDetailsState(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCancel(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .replace(",", "");
  };

  const filteredOrders = orders
    .filter((order) => {
      if (selectedCategory === "All Orders") return true;
      return (
        order.orderStatusDetailsSimple?.slice(-1)[0]?.statusName ===
        selectedCategory
      );
    })
    .sort((b, a) => new Date(a.orderCreatedAt) - new Date(b.orderCreatedAt));

  const handleRefund = async (item) => {
    try {
      await requestRefund(item.orderItemId);
      toast.success("Your Order has been refunded request");
      loadOrders();
      setViewDetailsState(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRateClick = (order) => {
    setSelectedOrderForFeedback(order);  // Set the selected order for feedback
    setVisible(true);  // Hiển thị modal feedback
  };

  return (
    <motion.div
      className={`overflow-y-scroll flex flex-col mb-[5%]  `}
      initial={{ width: "75%" }}
      animate={{ width: ViewDetails ? "100%" : "75%" }}
      transition={
        ViewDetails ? { delay: 0.8, duration: 1 } : { delay: 0.5, duration: 1 }
      }
    >
     {orders && orders.length > 0 ? (
      <AnimatePresence>
        {(ViewDetails && selectedOrder ? [selectedOrder] : filteredOrders).map(
          (order, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                type: "spring",
                damping: 10,
                delay: index * 0.2,
              }}
              className="w-full h-fit flex flex-col border-1 border-gray-300 mb-4"
            >
              <div className="grid grid-cols-5  items-center p-4 bg-gray-100">
                <div className="flex col-span-4 w-full gap-4 justify-start">
                  <div>Order ID: {order.orderId}</div>
                  <div>Order Date: {formatDate(order.orderCreatedAt)}</div>
                </div>

                <div className="flex w-full justify-end">
                  {ViewDetails ? (
                    <motion.button
                      className="border-1 px-3 py-1 w-[70%] rounded-md text-center font-bold"
                      initial={{
                        backgroundColor: "#f3f4f6",
                        color: "black",
                        opacity: 0,
                      }}
                      animate={{ opacity: 1 }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#ef4444",
                        color: "white",
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedOrder(null); // Reset selected order
                        setViewDetailsState(false);
                      }}
                    >
                      Back
                    </motion.button>
                  ) : (
                    <div>
                      {order.orderStatusDetailsSimple?.slice(-1)[0]
                        ?.statusName || "Pending"}
                    </div>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -50, height: 0 }}
                animate={
                  ViewDetails
                    ? { opacity: 1, y: 0, height: "20%" }
                    : { opacity: 0 }
                }
                exit={{ opacity: 0, y: -50, height: 0 }}
                transition={{ duration: 1, type: "spring", damping: 10 }}
                className={`items-center flex flex-col px-10 py-5 `}
              >
                <OrderSteps order={order} />

                <div className="flex w-full flex-row gap-[7%]">
                  {order.orderItems.length > 0 ? (
                    order.orderStatusDetailsSimple.map((status, index) => (
                      <div
                        key={index}
                        className=" w-[15%] text-gray-500 text-[70%] h-fit"
                      >
                        {formatDate(status.updatedAt)}
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              </motion.div>

              <motion.div
                className={`p-[2%] flex flex-col border-y-1 border-dashed ${
                  ViewDetails ? "" : "hidden"
                }`}
                initial={{ opacity: 0, y: -50, height: 0 }}
                animate={
                  ViewDetails
                    ? { opacity: 1, y: 0, height: "fit-content" }
                    : { opacity: 0 }
                }
                exit={{ opacity: 0, y: -50, height: 0 }}
                transition={{ duration: 1, type: "spring", damping: 10 }}
              >
                <span className="text-[1.8vw] font-bold">Delivery Address</span>
                <span className="flex flex-row ">
                  <span className="flex flex-col w-[30%] ">
                    <span className="text-[1vw]">{order.address?.name}</span>
                    <span className="text-[0.9vw] text-gray-400">
                      {order.address?.phoneNumber}{" "}
                    </span>
                  </span>
                  <span className="text-[1.2vw] w-[70%] text-gray-400">
                    {order.address?.addressDetail ?? ""}{" "}
                    {order.address?.district ?? ""}{" "}
                    {order.address?.province ?? ""} {order.address?.ward ?? ""}
                  </span>
                </span>
              </motion.div>

              {order.orderItems.length > 0 > 0 ? (
                (ViewDetails
                  ? order.orderItems
                  : order.orderItems.slice(0, 1)
                ).map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      damping: 10,
                      delay: itemIndex * 0.2,
                    }}
                    className="flex border-b-1  py-3 border-gray-200 h-28 px-4"
                  >
                    <div className="flex gap-1 w-2/4">
                      <div className="w-1/4 bg-pink-200">
                        <img
                          src={
                            item.userRolledItemForManageOrder
                              ? item.userRolledItemForManageOrder
                                  .boxItemImageUrl
                              : item.imageUrl
                          }
                          alt={item.boxName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-3/4 flex flex-col">
                        <span className="font-bold text-xl">
                          {item.boxName}
                        </span>
                        <span className="text-sm text-gray-500">
                          Option: {item.boxOptionName}
                        </span>
                        <span className="text-sm text-gray-400">
                          Quanity: {item.quantity}
                        </span>
                        {item.userRolledItemForManageOrder != null ? (
                          <span className="text-sm text-gray-400">
                            <p>From Online Lucky Box</p>
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-1/4">
                      <span className="text-sm text-red-500">
                        {item.openRequest ? "Open Requested" : ""}
                      </span>
                      {item.openRequestNumber && item.openRequestNumber > 0 ? (
                        <>
                          {" "}
                          {item.orderStatusCheckCardImage &&
                          item.orderStatusCheckCardImage.length > 0 ? (
                            <div className="flex flex-col justify-center items-center">
                              <span
                                className="text-sm hover:underline cursor-pointer"
                                onClick={() => {
                                  setCheckCard(item.orderStatusCheckCardImage);
                                  setVisible(true);
                                }}
                              >
                                View Card
                              </span>

                              {/* Image Preview Group */}
                              {visible && checkCard?.length > 0 && (
                                <Image.PreviewGroup
                                  style={{ display: "none", height: 0 }}
                                  preview={{
                                    visible,
                                    onVisibleChange: (vis) => setVisible(vis),
                                  }}
                                >
                                  {checkCard.map((img, imgIndex) => (
                                    <Image
                                      key={imgIndex}
                                      style={{ display: "none" }}
                                      src={img}
                                    />
                                  ))}
                                </Image.PreviewGroup>
                              )}
                            </div>
                          ) : (
                            <p>Waiting to Open {item.openRequestNumber} box</p>
                          )}
                        </>
                      ) : (
                        <> </>
                      )}
                    </div>
                    <div className="flex justify-center items-center w-1/4">
                      {ViewDetails ? (
                        <div className="flex flex-col h-full gap-3 items-center justify-end">
                          <div>{item.orderPrice.toLocaleString() + " đ"}</div>

                          {order.currentStatusId === 5 && (
                            <>
                              {item.refundStatus === "Available" ? (
                                <div className="flex flex-row gap-x-3 items-end">
                                <motion.button
                                    className="border-1 px-3 h-full text-[0.9vw] rounded-md font-bold"
                                    initial={{
                                      backgroundColor: "#ef4444",
                                      color: "white",
                                      border: "1px solid #f3f4f6",
                                    }}
                                    whileHover={{
                                      backgroundColor: "#ef4444",
                                      color: "white",
                                      border: "1px solid white",
                                      scale: 1.1,
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleRateClick(order)}
                                    disabled={order.hasFeedback} // Disable rate button if feedback exists
                                  >
                                    Rate
                                  </motion.button>
                                  <div className="items-end flex">
                                    <Button onClick={() => handleRefund(item)}>
                                      Request Refund
                                    </Button>
                                  </div>
                                  
                                </div>
                              ) : (
                                <></>
                              )}

                              {item.refundStatus === "Request" ? (
                                <div>
                                  <Button disabled>Requested Refund</Button>
                                </div>
                              ) : (
                                <></>
                              )}

                              {item.refundStatus === "Resolved" && (
                                <p>
                                  Your Item has been refunded:{" "}
                                  {item.numOfRefund} quantity
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <motion.button
                          className="border-1 px-3 py-1 w-[80%] rounded-md font-bold"
                          initial={{
                            backgroundColor: "#f3f4f6",
                            color: "black",
                          }}
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#ef4444",
                            color: "white",
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedOrder(order); // Set the specific order to display
                            setViewDetailsState(true);
                          }}
                        >
                          See Details
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400">
                  No items in this order
                </div>
              )}

              <div className=" gap-4 px-8 p-2 bg-white h-fit border-dashed border-t-1">
                <div className="flex flex-col text-end text-2xl w-full gap-4 py-4">
                  <div>Subtotal: {order.subTotal.toLocaleString() + " đ"}</div>
                  <div>
                    Shipping Fee: {order.shippingFee.toLocaleString() + " đ"}
                  </div>
                  <div>
                    Total Order: {order.totalPrice.toLocaleString() + " đ"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Payment Method: {order.paymentMethod}{" "}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  {order.orderStatusDetailsSimple?.slice(-1)[0]?.statusName ===
                    "Pending" && order.paymentMethod === "COD" ? (
                    <motion.button
                      className="border-1 px-3 py-1 w-[25%] text-[0.9vw] rounded-md font-bold"
                      initial={{
                        backgroundColor: loadingCancel ? "gray" : "#ef4444",
                        color: "white",
                        border: "1px solid #f3f4f6",
                      }}
                      whileHover={{
                        backgroundColor: loadingCancel ? "gray" : "#ef4444",
                        color: "white",
                        border: "1px solid white",
                        scale: 1.1,
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCancelOrder(order.orderId)}
                      disabled={loadingCancel}
                    >
                      {loadingCancel ? (
                        <>
                          <LoadingOutlined /> Cancelling...
                        </>
                      ) : (
                        "Cancel Order"
                      )}
                    </motion.button>
                  ) : order.orderStatusDetailsSimple?.slice(-1)[0]
                      ?.statusName === "Arrived" && !ViewDetails ? (
                    <>
                        <motion.button
                        className="border-1 px-3 py-1 w-[20%] text-[0.9vw] rounded-md font-bold"
                        initial={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "1px solid #f3f4f6",
                        }}
                        whileHover={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "1px solid white",
                          scale: 1.1,
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setSelectedOrder(order); // Set the specific order to display
                            setViewDetailsState(true);
                          }}
                        
                      >
                        Rate
                      </motion.button>
                      {/* <motion.button
                        className="border-1 px-3 py-1 w-[40%] text-[0.9vw] rounded-md font-bold"
                        initial={{ border: "1px solid #f3f4f6" }}
                        whileHover={{
                          backgroundColor: "black",
                          color: "white",
                          border: "1px solid white",
                          scale: 1.1,
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRefund(order)}
                      >
                        Request for Return/Refund
                      </motion.button> */}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
     ) : (
       <div className="text-center text-gray-400">No orders </div>
     )}

      {/* Feedback Modal */}
      {selectedOrderForFeedback && (
  <FeedbackModal
    orderId={selectedOrderForFeedback.orderId}
    visible={visible}
    setVisible={setVisible}
    onFeedbackSubmitted={() => {
      loadOrders(); 
      setVisible(false); 
    }}
    selectedOrderForFeedback={selectedOrderForFeedback} 

  />
)}
    </motion.div>
  );
};
export default OrderItems;
