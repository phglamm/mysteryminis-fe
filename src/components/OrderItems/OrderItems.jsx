/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../config/api";
import OrderSteps from "../OrderStepper/OrderStepper";

import toast from "react-hot-toast";
import { selectUser } from "../../Redux/features/counterSlice";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Image } from "antd";

const checkCards = [
  "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
  "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
  "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
];

const OrderItems = ({ selectedCategory, setViewDetails }) => {
  const [ViewDetails, setViewDetailsState] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const user = useSelector(selectUser);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checkCard, setCheckCard] = useState(null);
  console.log(checkCard);
  const fetchOrders = async () => {
    try {
      const response = await api.get(`Order?userId=${user.userId}`);
      // const response = await api.get('Order');
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setViewDetails(ViewDetails);
  }, [ViewDetails]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setViewDetails(ViewDetails);
  }, [ViewDetails]);

  const cancelOrders = async (orderId) => {
    setLoadingCancel(true);
    try {
      const response = await api.put(`Order/cancel/${orderId}`);
      console.log(response.data);
      fetchOrders();
      setViewDetailsState(false);
      toast.success("Order has been cancelled");
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

  return (
    <motion.div
      className={`overflow-y-scroll flex flex-col mb-[5%]  `}
      initial={{ width: "75%" }}
      animate={{ width: ViewDetails ? "100%" : "75%" }}
      transition={
        ViewDetails ? { delay: 0.8, duration: 1 } : { delay: 0.5, duration: 1 }
      }
    >
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
                    <span className="text-[1vw]">{user.fullname}</span>
                    <span className="text-[0.9vw] text-gray-400">
                      {user.phone}{" "}
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
                          src={item.imageUrl}
                          alt={item.boxName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-3/4 flex flex-col">
                        <span className="font-bold text-xl">
                          {item.boxName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.boxOptionName}
                        </span>
                        <span className="text-sm text-gray-400">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center w-1/4">
                      <span className="text-sm text-red-500">
                        {item.openRequest ? "Open Requested" : ""}
                      </span>
                      {item.orderStatusCheckCardImage &&
                        item.orderStatusCheckCardImage.length > 0 && (
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
                                {checkCards.map((img, imgIndex) => (
                                  <Image
                                    key={imgIndex}
                                    style={{ display: "none" }}
                                    src={img}
                                  />
                                ))}
                              </Image.PreviewGroup>
                            )}
                          </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center w-1/4">
                      {ViewDetails ? (
                        <div>{item.orderPrice}</div>
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
                  <div>
                    Order Total: {order.totalPrice.toLocaleString() + " đ"}
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
                      onClick={() => cancelOrders(order.orderId)}
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
                      ?.statusName === "Arrived" ? (
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
                      >
                        Rate
                      </motion.button>
                      <motion.button
                        className="border-1 px-3 py-1 w-[40%] text-[0.9vw] rounded-md font-bold"
                        initial={{ border: "1px solid #f3f4f6" }}
                        whileHover={{
                          backgroundColor: "black",
                          color: "white",
                          border: "1px solid white",
                          scale: 1.1,
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Request for Return/Refund
                      </motion.button>
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
    </motion.div>
  );
};
export default OrderItems;
