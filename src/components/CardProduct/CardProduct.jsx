import React, { useState } from "react";
import { Card, Button, Tag } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { route } from "../../routes";

const { Meta } = Card;

const CardProduct = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  const firstImageUrl = product.boxImage[0]?.boxImageUrl;
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
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const navigate = useNavigate();
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
            minHeight: "50px",
          }}
        >
          <p style={{ fontSize: "14px", color: "#333" }}>{brandName}</p>

          <Meta
            title={boxName}
            description={
              <strong style={{ color: "#e60000", fontSize: "16px" }}>
                {formatPrice(displayPrice)}
              </strong>
            }
          />
        </div>

        {!inStock && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <Tag color="red">Sold Out</Tag>
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
          <Button
            onClick={() =>
              navigate(`${route.product}/${route.detail}/${product.boxId}`)
            }
            type="default"
            style={{
              width: "180px",
              height: "45px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
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
