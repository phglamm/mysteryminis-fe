import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import api from "../../../config/api";
import BoxModel from "../../../components/3DBoxModel/BoxModel";
import Logo from "../../../assets/images/Logo-removebg.png";
import { useSelector } from "react-redux";
import { selectUser } from "../../../Redux/features/counterSlice";
import { motion } from "framer-motion";
import { UpSquareOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
const OnlineBlindBox = () => {
  const [plays, setPlays] = useState(false);
  const [blindbox, setBlindBox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const { packageId } = useParams();
  const [numberBlindBoxItem, setNumberBlindBoxItem] = useState();
  const user = useSelector(selectUser);

  console.log("Selected Box ID from URL:", packageId);
  const isPlay = useLocation().state?.isPlay;
  const reward = useLocation().state?.reward;

  const fetchBlindBox = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await api.get(`online-serie-box/${packageId}`);
      setBlindBox(response.data);
      setNumberBlindBoxItem(response.data.boxItemResponseDtos?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [packageId]);

  useEffect(() => {
    fetchBlindBox();
    setNumberBlindBoxItem(
      blindbox.boxItemResponseDtos ? blindbox.boxItemResponseDtos.length : 0
    );
  }, [plays]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const firstHalfBlindBoxItem = Math.ceil(numberBlindBoxItem / 2);

  const paymentHandler = async () => {
    if (!user) {
      toast.error("Please login to checkout");
      return;
    }

    if (user.isActive === false) {
      toast.error(
        "Your account is not active, please contact admin to active your account"
      );
      return;
    }
    try {
      const requestData = {
        userId: user.userId, // Replace with actual user ID
        totalPrice: blindbox.boxOption.displayPrice || 0,
        subTotal: blindbox.boxOption.displayPrice || 0,
        shippingFee: 0,
        voucherId: null,
        paymentMethod: "VNPAY", // Modify as needed
        // Replace with actual address ID if required
        discountAmount: 0,
        orderItemRequestDto: [
          {
            quantity: 1,
            price: blindbox.boxOption.displayPrice || 0,
            boxOptionId: blindbox.boxOption.boxOptionId || 0,
            originPrice: blindbox.boxOption.originPrice || 0,
            isOnlineSerieBox: true,
            orderItemOpenRequestNumber: 0,
          },
        ],
      };

      console.log("Sending payment request:", JSON.stringify(requestData));

      const response = await api.post("Payment/make-Payment", requestData);
      console.log("Payment successful:", response.data);
      window.location.assign(response.data);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment failed:", error);
    }
  };

  useEffect(() => {
    if (isPlay) {
      setPlays(isPlay);
    }
  }, []);
  return (
    <div className="lg:pt-[6.8%] pt-[12%] h-screen justify-center items-center text-center flex flex-col">
      {loading ? ( // Show loading indicator if loading is true
        <div className="flex bg-black flex-col h-full justify-center items-center w-full">
          <div className="flex justify-center h-full w-full relative">
            <div className="w-[50%] flex justify-center items-center h-[100%] absolute z-10">
              <img src={Logo} alt="Logo" className="w-[50%] h-fit" />
            </div>
          </div>
        </div>
      ) : (
        blindbox.boxOption && (
          <div className="flex bg-black flex-col h-full justify-center items-center w-full">
            <div className="flex justify-center h-full w-full relative">
              <div className="w-[50%] flex justify-center items-center h-[100%] absolute z-10">
                <img src={Logo} alt="Logo" className="w-[50%] h-fit" />
              </div>
              {!plays ? (
                <>
                  {/* Left Section */}
                  <div
                    className={`h-full py-[4%] flex gap-5 flex-col justify-center items-center w-[30%] relative ${
                      showVideo ? "z-10" : "z-40"
                    }`}
                  >
                    {blindbox.boxItemResponseDtos
                      ?.slice(0, firstHalfBlindBoxItem)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`items-center gap-3 w-[80%] rounded-3xl ${
                            item?.isSecret
                              ? "bg-gradient-to-r from-amber-200 to-yellow-500 shadow-amber-200 shadow-xl"
                              : "bg-white/70 shadow-pink-200 shadow-xl"
                          }  flex flex-row`}
                          style={{
                            height: `${100 / firstHalfBlindBoxItem}%`,
                            maxHeight: "25%",
                          }}
                        >
                          <div className=" items-center px-3 gap-3 w-[100%] rounded-3x h-[100%] flex flex-row">
                            <img
                              src={item.imageUrl}
                              alt={item.boxItemName}
                              className=" bg-red-200 w-[40%] h-[90%] relative z-30 rounded-xl"
                            />
                            <div className="text-center z-30 relative px-5 w-[60%] font-bold truncate">
                              {item.boxItemName}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Center Section */}
                  <div
                    className={`h-fit justify-between flex flex-col pt-[2%] w-[40%] relative ${
                      showVideo ? "z-10" : "z-40"
                    }`}
                  >
                    <div>
                      <div className="text-4xl z-40 font-bold">
                        {blindbox.boxOption.boxOptionName}
                      </div>
                      <div className="z-40">
                        {blindbox.brandDtoResponse?.brandName}
                      </div>
                      <div className="flex flex-row justify-center gap-2 z-40">
                        <div
                          className={`text-sm px-3 py-1 rounded-md ${
                            blindbox.isSecretOpen
                              ? "bg-gray-500"
                              : "bg-gradient-to-r from-amber-200 to-yellow-500"
                          }`}
                        >
                          {blindbox.isSecretOpen ? "Secret Opened" : "Secret"}
                        </div>
                        <div
                          className={`text-sm px-3 gap-1 py-1 items-center justify-center flex rounded-md ${
                            blindbox.isSecretOpen
                              ? "bg-white border-2"
                              : blindbox.priceIncreasePercent > 20
                              ? "bg-gradient-to-r from-red-500 to-orange-500"
                              : "bg-gradient-to-b from-sky-400 to-sky-200"
                          }`}
                        >
                          <UpSquareOutlined />{" "}
                          {blindbox.isSecretOpen
                            ? "0"
                            : blindbox.priceIncreasePercent}
                          %
                        </div>
                        <div
                          className={`text-sm px-3 py-1 rounded-md bg-gradient-to-r from-green-400 to-blue-500`}
                        >
                          Turn {blindbox.turn}/{blindbox.maxTurn}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button - Foreground */}
                  <div className="absolute bottom-20">
                    <motion.button
                      className={`p-1 px-6 rounded-2xl flex bg-gradient-to-tl relative from-amber-500 to-yellow-400 ${
                        showVideo ? "z-10" : "z-40"
                      }`}
                      onClick={paymentHandler}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {/* {blindbox.boxOption.displayPrice.toLocaleString()} VNĐ */}
                      {Number(blindbox.boxOption.displayPrice).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 0, maximumFractionDigits: 0 }
                      )}{" "}
                      VNĐ
                    </motion.button>
                  </div>

                  {/* Right Section */}
                  <div
                    className={`h-full py-[4%] flex gap-5 flex-col justify-center items-center w-[30%] relative ${
                      showVideo ? "z-10" : "z-40"
                    }`}
                  >
                    {blindbox.boxItemResponseDtos
                      ?.slice(firstHalfBlindBoxItem)
                      .map((item, index) => (
                        <div
                          className={`items-center px-3 gap-3 w-[80%] rounded-3xl ${
                            item?.isSecret
                              ? "bg-gradient-to-r from-amber-200 to-yellow-500  shadow-amber-200 shadow-xl"
                              : "bg-white/70  shadow-pink-200 shadow-xl"
                          } flex flex-row`}
                          style={{
                            height: `${100 / firstHalfBlindBoxItem}%`,
                            maxHeight: "25%",
                          }}
                          key={index}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.boxItemName}
                            className=" bg-red-200 w-[40%] h-[90%] rounded-xl"
                          />
                          <div className="text-center px-5 w-[60%] font-bold truncate">
                            {item.boxItemName}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              ) : null}

              <div className="h-full w-full absolute z-30 flex flex-col items-center">
                {/* BoxModel - Background Layer */}
                {blindbox.onlineSerieBoxId && (
                  <div className="absolute top-0 left-0 w-full h-full z-20">
                    <BoxModel
                      plays={plays}
                      setPlays={setPlays}
                      reward={reward}
                      fetchBlindBox={fetchBlindBox}
                      showVideo={showVideo}
                      setShowVideo={setShowVideo}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default OnlineBlindBox;
