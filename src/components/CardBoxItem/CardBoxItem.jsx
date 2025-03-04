import React, { useState } from "react";
import { Card, Button, Tag, Rate } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { route } from "../../routes";

const { Meta } = Card;

const CardBoxItem = ({ Item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", damping: 10 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        hoverable
        style={{
          borderRadius: "12px",
          transition: "transform 0.3s ease-in-out",
          position: "relative",
          overflow: "hidden",
          minHeight: "400px",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        cover={
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "8px",
              height: "300px",
            }}
          >
            <img
              src={Item.imageUrl || "https://via.placeholder.com/300"}
              alt={Item.boxItemName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </div>
        }
      >
        <div
          style={{
            textAlign: "center",
            transition: "opacity 0.3s ease-in-out",
            opacity: hovered ? 0 : 1,
            height: hovered ? "0px" : "auto",
            overflow: "hidden",
            minHeight: "50px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#333" }}>
            Color: {Item.boxItemColor}
          </p>

          <Meta
            title={Item.boxItemName}
            description={<Rate allowHalf value={Item.averageRating} disabled />}
          />
        </div>

        {Item.isSecret && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <Tag color="red">Secret</Tag>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "opacity 0.3s ease-in-out",
            opacity: hovered ? 1 : 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link to={`${route.boxItemDetail}/${Item._id}`}>
            <Button
              type="default"
              style={{
                width: "180px",
                height: "45px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "1px solid black",
              }}
            >
              Watch More
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default CardBoxItem;
