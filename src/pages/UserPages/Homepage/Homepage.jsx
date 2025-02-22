import { useState, useEffect } from "react";
import { Card } from "antd";
import { motion } from "framer-motion";
import BlurText from "../../../components/React_Bits/BlurText/BlurText";
import FadeContent from "../../../components/React_Bits/FadeContent/FadeContent";
import CountUp from "../../../components/React_Bits/CountUp/CountUp";
import ImageContent from "./ImageContent/ImageContent";

export default function Homepage() {
  const [cardData, setCardData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        let url = "https://mysteryminis-b3are0btehhncpcx.australiacentral-01.azurewebsites.net/api/Box/allbox";
        if (selectedCategory === "BestSeller") {
          url = "https://mysteryminis-b3are0btehhncpcx.australiacentral-01.azurewebsites.net/api/Box/best-seller-box?quantityWantToGet=10";
        }
        const response = await fetch(url);
        const data = await response.json();
        if (isMounted) {
          const formattedData = data.slice(0, 10).map((box) => ({
            id: box.boxId,
            name: box.boxName,
            imageSrc: box.imageUrl.length > 0 ? box.imageUrl[0] : "https://via.placeholder.com/150",
          }));
          setCardData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const categories = ["All", "BestSeller", "Sale Off", "Yooki", "BabyThree"];

  return (
    <div className="mt-24">
      <ImageContent />
      
      <div className="text-center flex flex-col items-center" style={{ userSelect: "none" }}>
        <BlurText text="MYSTERY MINIS" delay={50} animateBy="letters" direction="top" className="text-6xl mb-4 font-sans" />
        <BlurText text="Unbox the Unexpected! Every Box Holds a Secret!" delay={60} animateBy="letters" direction="bottom" className="text-3xl mb-2 text-gray-500 font-sans" />
        <motion.div 
          initial={{ scale: 1, opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 2, duration: 4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex gap-1 h-fit mb-8"
        >
          +<CountUp from={0} to={89} separator="," direction="up" delay={2.5} duration={2} className="count-up-text" />
          <p>Stores Worldwide</p>
        </motion.div>
              
        <div className="border-t-1 border-gray-400 w-[70%] mb-8 flex justify-center gap-4">
          {categories.map((label, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 ,scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 * index }}
            >
              <motion.button
                className={`px-10 py-1 mt-2 font-bold rounded-full border-2 transition-all ${selectedCategory === label ? 'bg-red-500 text-white' : 'bg-white text-black'}`}
                initial={{ opacity: 0 ,scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedCategory(label)}
              >
                {label}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-5 p-4 w-[70%] gap-5 h-[38vw] ">
          {cardData.map((card, index) => (
            <FadeContent blur={true} duration={1200} easing="ease-in-out" initialOpacity={0}  key={index} >
              <motion.div
             
                initial={{ scale: 1, opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card hoverable cover={<img alt={card.name} src={card.imageSrc} className="h-[12vw] bg-amber-200" />}>
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