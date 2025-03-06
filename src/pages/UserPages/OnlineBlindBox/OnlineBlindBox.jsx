import InfiniteScroll from "../../../components/React_Bits/InfiniteScroll/InfiniteScroll";
import gift from "../../../assets/images/OpenedGift.webm";


import { useState } from "react";
import SplashCursor from "../../../components/React_Bits/SplashCursor/SplashCursor";
import BoxModel from "../../../components/3DBoxModel/BoxModel";
import RollingGallery from "../../../components/React_Bits/RollingGallery/RollingGallery";
import { Button, Card } from "antd";

const OnlineBlindBox = () => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [plays, setPlays] = useState(false);
  console.log(selectedBox);
  return (
    <div className="pt-[7%] h-screen  flex flex-col">
      {/* <SplashCursor/> */}

      {/* Package Details */}
      <div className="h-1/2">
        <BoxModel plays={plays} setPlays={setPlays} />
      </div>
      <div className="h-1/2 w-full flex justify-center items-center">
        <Button onClick={() => setPlays(!plays)}>Play</Button>
        </div>

    </div>
  );
};

export default OnlineBlindBox;
