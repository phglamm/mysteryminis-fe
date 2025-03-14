import InfiniteScroll from "../../../components/React_Bits/InfiniteScroll/InfiniteScroll";
import gift from "../../../assets/images/OpenedGift.webm";


import { useCallback, useEffect, useState } from "react";
import SplashCursor from "../../../components/React_Bits/SplashCursor/SplashCursor";
import BoxModel from "../../../components/3DBoxModel/BoxModel";
import RollingGallery from "../../../components/React_Bits/RollingGallery/RollingGallery";
import { Button, Card } from "antd";
import { useParams } from "react-router-dom";
import api from "../../../config/api";

const OnlineBlindBox = () => {
  const [plays, setPlays] = useState(false);
  const [blindbox, setBlindBox] = useState([]);
  const { packageId } = useParams(); 
  console.log("Selected Box ID from URL:", packageId);

  const fetchBlindBox = useCallback(async () => {
    try {
      const response = await api.get(`online-serie-box/${packageId}`);
      setBlindBox(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [packageId]);

  useEffect(() => {
    fetchBlindBox();
  }, [plays, fetchBlindBox]);
  
  return (
    <div className="pt-[15%] h-screen justify-center items-center text-center p-[5%] bg-amber-400  flex flex-col">
      {/* <SplashCursor/> */}

      {/* Package Details */}      
      {blindbox.boxOption ? (
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center -mb-[8%]">
            <div className="text-4xl font-bold">{blindbox.boxOption.boxOptionName}</div>
            <div>{blindbox.brandDtoResponse.brandName}</div>
          </div>
          
          <div className=" flex justify-center h-[75vh] w-[100%]">
          <div className="h-[100%] w-[30%] bg-blue-600">
            hi
          </div>
          <div className="h-[100%] w-[40%] ">
            {blindbox.onlineSerieBoxId && (
              <BoxModel plays={plays} setPlays={setPlays} onlineSerieBoxId={blindbox.onlineSerieBoxId} />
            )}
            <div className="-mt-[20%]">
              <Button onClick={() => setPlays(!plays)}>{blindbox.boxOption.displayPrice}</Button>
            </div>
          </div>
          <div className="h-[100%] w-[30%] bg-blue-600">

          </div>
          </div>
        </div>
        
      ) : (
        <h1>Loading...</h1>
      )}
      
    </div>
  );
};

export default OnlineBlindBox;
