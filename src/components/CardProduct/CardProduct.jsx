import React, { useState } from "react";
import { Card, Button, Tag } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";

const { Meta } = Card;

const CardProduct = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  if (!product) {
    return <div>Loading...</div>;
  }

  const firstImageUrl = product.boxImage[0]?.boxImageUrl || "https://cdn-icons-png.flaticon.com/512/138/138574.png";
  const hoverImageUrl = product.boxImage[1]?.boxImageUrl;
  const brandName = product.brandName;
  const boxName = product.boxName;
  const inStock = product.boxOptions.some(
    (option) => option.boxOptionStock > 0
  );

  const displayPrice = product.boxOptions.reduce((minPrice, option) => {
    return option.displayPrice < minPrice ? option.displayPrice : minPrice;
  }, product.boxOptions[0]?.displayPrice);

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
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
          borderRadius: "10px",
          transition: "transform 0.3s ease-in-out",
          position: "relative",
          overflow: "hidden",
          minHeight: "320px",
          minWidth: "220px",
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
              borderRadius: "6px",
              height: "200px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={hovered && hoverImageUrl ? hoverImageUrl : firstImageUrl}
              alt={boxName}
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
            minHeight: "40px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#333" }}>{brandName}</p>

          <Meta
            title={<span style={{ fontSize: "14px" }}>{boxName}</span>}
            description={
              <strong style={{ color: "#e60000", fontSize: "14px" }}>
                {formatPrice(displayPrice)}
              </strong>
            }
          />
        </div>

        {!inStock && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
          >
            <Tag color="red">Sold Out</Tag>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            transition: "opacity 0.3s ease-in-out",
            opacity: hovered ? 1 : 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() =>
              navigate(`${route.product}/${route.detail}/${product.boxId}`)
            }
            type="default"
            style={{
              width: "140px",
              height: "38px",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "6px",
              border: "1px solid black",
              backgroundColor: inStock ? "#fff" : "#f0f0f0",
              color: inStock ? "#333" : "#999",
            }}
            disabled={!inStock}
          >
            {inStock ? "Xem chi tiết" : "Hết hàng"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CardProduct;
