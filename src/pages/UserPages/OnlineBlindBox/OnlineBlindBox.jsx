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
  }, []);
  
  return (
    <div className="pt-[10%] h-screen  flex flex-col">
      {/* <SplashCursor/> */}

      {/* Package Details */}
      <div className="h-[70%] justify-center flex-col items-center text-center p-[1%] bg-amber-400">
      {blindbox.boxOption ? (
        <h1>{blindbox.boxOption.boxOptionName}</h1>
      ) : (
        <h1>Loading...</h1>
      )}
      <BoxModel plays={plays} setPlays={setPlays} />
      </div>
      <div className="h-1/2 w-full flex justify-center items-center">
        <Button onClick={() => setPlays(!plays)}>Play</Button>
        </div>

    </div>
  );
};

export default OnlineBlindBox;
