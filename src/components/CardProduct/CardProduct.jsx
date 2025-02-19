import React, { useState } from "react";
import { Card, Button, Tag } from "antd";
import { motion } from "framer-motion";

const { Meta } = Card;

const CardProduct = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 , y: 50}}
      animate={{ opacity: 1, y: 0}}
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
              src={hovered && product.hoverImage ? product.hoverImage : product.image}
              alt={product.name}
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
          <p style={{ fontSize: "14px", color: "#333" }}>{product.brand}</p>

          <Meta 
            title={product.name} 
            description={<strong style={{ color: "#e60000", fontSize: "16px" }}>{product.price}</strong>} 
          />
        </div>

        {!product.inStock && (
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
            type="default"
            style={{
              width: "180px",
              height: "45px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "1px solid black",
              backgroundColor: product.inStock ? "#fff" : "#f0f0f0",
              color: product.inStock ? "#333" : "#999",
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? "Tùy chọn" : "Hết hàng"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CardProduct;
