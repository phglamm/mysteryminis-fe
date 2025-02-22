import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../config/api";
import CardBoxItem from "../../../components/CardBoxItem/CardBoxItem";
import { Pagination } from "antd";
import TiltedCard from "../../../components/React_Bits/TiltedCard/TiltedCard";
import BlurText from "./../../../components/React_Bits/BlurText/BlurText";

export default function BoxItemPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [boxItems, setBoxItems] = useState([]);
  useEffect(() => {
    const fetchBoxItem = async () => {
      const response = await api.get("BoxItem");
      console.log(response.data);
      const sortResponse = response.data.sort(
        (a, b) => b.boxItemId - a.boxItemId
      );
      setBoxItems(sortResponse);
    };
    fetchBoxItem();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentBoxItem = boxItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="mt-34">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", damping: 10 }}
        >
          <TiltedCard
            imageSrc="https://global-static.popmart.com/globalAdmin/1738891844056____pc-1____.jpg?x-oss-process=image/format,webp"
            captionText="Welcome to Mystery Minis"
            containerHeight="500px"
            containerWidth="100%"
            imageHeight="100%"
            imageWidth="100%"
            rotateAmplitude={2}
            scaleOnHover={1}
            showMobileWarning={true}
            showTooltip={true}
            displayOverlayContent={true}
          />
          <BlurText
            text="Hot Items"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-5xl font-bold text-center mt-10"
          />
          <div className="grid grid-cols-4 gap-4">
            {currentBoxItem.map((item) => (
              <div
                className="flex justify-center items-center mt-10"
                key={item.boxItemId}
              >
                {" "}
                <CardBoxItem
                  Item={item}
                  className="flex justify-center items-center"
                  key={item.boxItemId}
                />
              </div>
            ))}
          </div>

          <Pagination
            className="flex justify-center items-center !mt-10"
            current={currentPage}
            pageSize={pageSize}
            total={boxItems.length}
            onChange={handlePageChange}
          />
        </motion.div>
      </div>
    </div>
  );
}
