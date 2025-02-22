// ImageContent.js
import Labubu from "../../../../assets/images/Labubu.png";
import Yooki from "../../../../assets/images/yooki.png";
import Skull from "../../../../assets/images/SkullPanda.png";
import BB3 from "../../../../assets/images/BABY3.png";
import FadeContent from "../../../../components/React_Bits/FadeContent/FadeContent";
import TiltedCard from "../../../../components/React_Bits/TiltedCard/TiltedCard";


export default function ImageContent() {
  return (
    <FadeContent blur={false} duration={1000} easing="ease-out" initialOpacity={0}>
      <div className="grid grid-cols-3 p-14 pr-36 pl-36 gap-4">
        <div className="col-span-2 rounded-3xl h-96">
          <TiltedCard imageSrc={Labubu} altText="LABUBU - POPMART" captionText="LABUBU - POPMART" containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={7} scaleOnHover={1.1} showMobileWarning={false} showTooltip={true} displayOverlayContent={false} overlayContent={<p className="tilted-card-demo-text">LABUBU - POPMART</p>} />
        </div>
        <div className="h-96">
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-3xl h-48">
              <TiltedCard imageSrc={Skull} altText="SKULL PANDA - POPMART" captionText="SKULL PANDA - POPMART" containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={9} scaleOnHover={1.1} showMobileWarning={false} showTooltip={true} displayOverlayContent={false} overlayContent={<p className="tilted-card-demo-text">SKULL PANDA - POPMART</p>} />
            </div>
            <div className="grid grid-cols-2 gap-4 h-44">
              <div className="bg-green-400 rounded-3xl">
                <TiltedCard imageSrc={Yooki} altText="YOOKI - BLINDBOX" captionText="YOOKI - BLINDBOX" containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={9} scaleOnHover={1.1} showMobileWarning={false} showTooltip={true} displayOverlayContent={false} overlayContent={<p className="tilted-card-demo-text">YOOKI - BLINDBOX</p>} />
              </div>
              <div className="bg-yellow-400 rounded-3xl">
                <TiltedCard imageSrc={BB3} altText="BABYTHREE - BLINDBOX" captionText="BABYTHREE - BLINDBOX" containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={9} scaleOnHover={1.1} showMobileWarning={false} showTooltip={true} displayOverlayContent={false} overlayContent={<p className="tilted-card-demo-text">BABYTHREE - BLINDBOX</p>} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeContent>
  );
}
