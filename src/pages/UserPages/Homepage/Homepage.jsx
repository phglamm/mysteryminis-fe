import Labubu from "../../../assets/images/Labubu.png";
import Yooki from "../../../assets/images/yooki.png";
import Skull from "../../../assets/images/SkullPanda.png";
import BB3 from "../../../assets/images/BABY3.png";
import TiltedCard from "../../../components/React_Bits/TiltedCard/TiltedCard";
import BlurText from "../../../components/React_Bits/BlurText/BlurText";
import FadeContent from "../../../components/React_Bits/FadeContent/FadeContent";
import { motion } from "framer-motion";
import { Card } from "antd";
import CountUp from "../../../components/React_Bits/CountUp/CountUp";
export default function Homepage() {
  const cardData = [
    { id: 1, name: "Yooki", imageSrc: Yooki },
    { id: 2, name: "Labubu", imageSrc: Labubu },
    { id: 3, name: "Skull Panda", imageSrc: Skull },
    { id: 4, name: "Baby Three", imageSrc: BB3 },
    { id: 5, name: "Yooki", imageSrc: Yooki },
  ];

  return (
    <div className=" mt-24">
      {/* Image Content */}
      <FadeContent
        blur={true}
        duration={1000}
        easing="ease-out"
        initialOpacity={0}
      >
        <div className="grid grid-cols-3 p-14 pr-36 pl-36 gap-4">
          <div className=" col-span-2 rounded-3xl h-96">
            <TiltedCard
              imageSrc={Labubu}
              altText="LABUBU - POPMART"
              captionText="LABUBU - POPMART"
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              rotateAmplitude={7}
              scaleOnHover={1.1}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={false}
              overlayContent={
                <p className="tilted-card-demo-text">LABUBU - POPMART</p>
              }
            />
          </div>
          <div className="h-96">
            <div className="grid grid-cols-1 gap-4">
              <div className=" rounded-3xl h-48">
                <TiltedCard
                  imageSrc={Skull}
                  altText="SKULL PANDA - POPMART"
                  captionText="SKULL PANDA - POPMART"
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={9}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={false}
                  overlayContent={
                    <p className="tilted-card-demo-text">
                      SKULL PANDA - POPMART
                    </p>
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 h-44">
                <div className="bg-green-400 rounded-3xl">
                  <TiltedCard
                    imageSrc={Yooki}
                    altText="YOOKI - BLINDBOX"
                    captionText="YOOKI - BLINDBOX"
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={9}
                    scaleOnHover={1.1}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={false}
                    overlayContent={
                      <p className="tilted-card-demo-text">YOOKI - BLINDBOX</p>
                    }
                  />
                </div>
                <div className="bg-yellow-400 rounded-3xl">
                  <TiltedCard
                    imageSrc={BB3}
                    altText="BABYTHREE - BLINDBOX"
                    captionText="BABYTHREE - BLINDBOX"
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={9}
                    scaleOnHover={1.1}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={false}
                    overlayContent={
                      <p className="tilted-card-demo-text">
                        BABYTHREE - BLINDBOX
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeContent>

      {/* Content */}
      <div
        className="text-center flex flex-col items-center"
        style={{ userSelect: "none" }}
      >
        <BlurText
          text="MYSTERY MINIS"
          delay={50}
          animateBy="letters"
          direction="top"
          className="text-6xl mb-4 font-sans"
        />
        <BlurText
          text="Unbox the Unexpected! Every Box Holds a Secret!"
          delay={60}
          animateBy="letters"
          direction="bottom"
          className="text-3xl mb-2 text-gray-500 font-sans"
        />
        <motion.div 
                initial={{ scale: 1, opacity: 0 }}
                whileInView={{ opacity: 1}}
                transition={{delay: 2, duration: 4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex gap-1 h-fit mb-8"
          >
            +<CountUp
              from={0}
              to={89}
              separator=","
              direction="up"
              delay={2.5}
              duration={2}
              className="count-up-text"
            />
              <p>Stores Worldwide</p>
        </motion.div>
        <div 
          className="grid grid-cols-5 p-4  w-[70%] gap-5  h-[25vw] border-t-1 border-gray-400">
          {cardData.map((card) => (
            <FadeContent 
              blur={true}
              duration={1200}
              easing="ease-in-out"
              initialOpacity={0}
              key={card.id}
            >
              <motion.div
                initial={{ scale: 1, opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card
                  hoverable
                  cover={<img alt={card.name} src={card.imageSrc} className="h-[12vw] bg-amber-200" />}
                >
                  {card.name}
                </Card>
              </motion.div>
            </FadeContent>
            
          ))}
        </div>
      </div>
    </div>
  );
}
