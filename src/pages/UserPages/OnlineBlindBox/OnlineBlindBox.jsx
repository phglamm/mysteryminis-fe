import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import api from "../../../config/api";
import BoxModel from "../../../components/3DBoxModel/BoxModel";
import Logo from "../../../assets/images/Logo-removebg.png";

const OnlineBlindBox = () => {
  const [plays, setPlays] = useState(false);
  const [blindbox, setBlindBox] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state
  const [showVideo, setShowVideo] = useState(false);
  const { packageId } = useParams();
  console.log("Selected Box ID from URL:", packageId);

  const fetchBlindBox = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await api.get(`online-serie-box/${packageId}`);
      setBlindBox(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [packageId]);

  useEffect(() => {
    fetchBlindBox();
  }, [fetchBlindBox]);

  return (
    <div className="lg:pt-[6.8%] pt-[12%] h-screen justify-center items-center text-center flex flex-col">
      {loading ? ( // Show loading indicator if loading is true
        <h1>Loading...</h1>
      ) : (
        blindbox.boxOption && (
          <div className="flex bg-black flex-col h-full justify-center items-center w-full">
            <div className="flex justify-center h-full w-full relative">
              <div className="w-[50%] flex justify-center items-center h-[100%] absolute z-10">
                <img src={Logo} alt="Logo" className="w-[50%] h-fit" />
              </div>
              {/* Left Section */}
              <div
                className={`h-full flex gap-5 flex-col justify-center items-center w-[30%] relative ${
                  showVideo ? "z-10" : "z-40"
                }`}
              >
                {blindbox.boxItemResponseDtos
                  ?.slice(0, 3)
                  .map((item, index) => (
                    <img
                      key={index}
                      src={item.imageUrl}
                      alt={item.boxItemName}
                      className="w-[80%] bg-red-200 h-[25%]"
                    />
                  ))}
              </div>

              {/* Center Section */}
              <div className="h-fit justify-between flex flex-col pt-[5%] w-[40%] relative z-40">
                <div>
                  <div className="text-4xl z-40 font-bold">
                    {blindbox.boxOption.boxOptionName}
                  </div>
                  <div className="z-40">
                    {blindbox.brandDtoResponse?.brandName}
                  </div>
                </div>
              </div>

              {/* Button - Foreground */}
              <div className="absolute bottom-20 z-40">
                <Button onClick={() => setPlays(!plays)}>
                  {blindbox.boxOption.displayPrice}
                </Button>
              </div>

              <div className="h-full w-full absolute z-30 flex flex-col items-center">
                {/* BoxModel - Background Layer */}
                {blindbox.onlineSerieBoxId && (
                  <div className="absolute top-0 left-0 w-full h-full z-20">
                    <BoxModel
                      plays={plays}
                      setPlays={setPlays}
                      onlineSerieBoxId={blindbox.onlineSerieBoxId}
                      fetchBlindBox={fetchBlindBox}
                      showVideo={showVideo}
                      setShowVideo={setShowVideo}
                    />
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div
                className={`h-full flex gap-5 flex-col justify-center items-center w-[30%] relative ${
                  showVideo ? "z-10" : "z-40"
                }`}
              >
                {blindbox.boxItemResponseDtos?.slice(3,6).map((item, index) => (
                  <img
                    key={index}
                    src={item.imageUrl}
                    alt={item.boxItemName}
                    className="w-[80%] bg-red-200 h-[25%]"
                  />
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default OnlineBlindBox;
