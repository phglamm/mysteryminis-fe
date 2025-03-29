import { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import { motion } from "framer-motion";
import FadeContent from "../../../components/React_Bits/FadeContent/FadeContent";
import CountUp from "../../../components/React_Bits/CountUp/CountUp";
import ImageContent from "./ImageContent/ImageContent";
import { useNavigate } from "react-router-dom";
import { fetchBoxesHomePage } from "../../../config/Data";
import { useDispatch } from "react-redux";
import { loadBoxes } from "../../../Redux/features/boxSlice";

export default function Homepage() {
  const [cardData, setCardData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBoxesHomePage(selectedCategory).then((data) => {
      console.log("Data: ", data);
      const boxes = data.slice(0, 10).map((box) => ({
        id: box.boxId,
        name: box.boxName,
        imageSrc:
          box.imageUrl.length > 0
            ? box.imageUrl[0]
            : "https://via.placeholder.com/150",
      }));
      setCardData(boxes);
    });
  }, [selectedCategory]);

  useEffect(() => {
    setLoading(true);
    try {
      dispatch(loadBoxes());
    } catch (error) {
      console.log("Error: ", error);
    }
    setLoading(false);
  }, [dispatch]);

  console.log("Card Data: ", cardData);
  const categories = ["All", "BestSeller", "Sale Off", "Yooki", "BabyThree"];

  if (loading || !cardData.length) {
    return (
      <div className="w-full h-full min-h-screen  flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mt-[10%]">
      <ImageContent />

      <div
        className="text-center flex flex-col items-center"
        style={{ userSelect: "none" }}
      >
        {/* <BlurText
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
        /> */}

        <h className="text-6xl mb-4 font-sans">MYSTERY MINIS</h>
        <h4 className="text-3xl mb-2 text-gray-500 font-sans">
          Unbox the Unexpected! Every Box Holds a Secret!
        </h4>
        <motion.div
          initial={{ scale: 1, opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 2, duration: 4 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex gap-1 h-fit mb-8"
        >
          +
          <CountUp
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

        <div className="border-t-1 pt-4 border-gray-400 w-[70%] mb-8 flex justify-center lg:gap-4 gap-1">
          {categories.map((label, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 * index }}
              className="w-[20%]"
            >
              <motion.button
                className={`lg:px-[30%] px-[10%] w-full py-1 mt-2 font-bold text-[1vw] rounded-full shadow-black shadow-md transition-all ${
                  selectedCategory === label
                    ? "bg-red-500 text-white"
                    : "bg-white text-black"
                }`}
                initial={{ opacity: 0, scale: 1 }}
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

        <div className="grid overflow-hidden grid-cols-3 lg:grid-cols-5 p-4 w-[70%] gap-5 h-[85vw] md:h-[60vw] lg:h-[45vw]  ">
          {cardData.map((card, index) => (
            <FadeContent
              blur={true}
              duration={1200}
              easing="ease-in-out"
              initialOpacity={0}
              key={index}
            >
              <motion.div
                initial={{ scale: 1, opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-[20vw] shadow-xl shadow-gray-600 rounded-lg "
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={card.name}
                      src={card.imageSrc}
                      className="lg:h-[12vw] h-[20vw] bg-amber-200"
                    />
                  }
                  className="w-[100%] h-[310px]"
                  onClick={() => navigate(`/product/detail/${card.id}`)}
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
