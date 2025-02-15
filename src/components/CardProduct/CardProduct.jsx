import React, { useState } from "react";
import { Card, Button } from "antd";

const { Meta } = Card;

const CardProduct = ({ product }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      hoverable
      style={{
        borderRadius: "12px",
        transition: "transform 0.3s ease-in-out",
        position: "relative",
        overflow: "hidden",
        minHeight: "400px", // Đặt chiều cao cố định cho card để tránh nhảy
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
            height: "300px", // Giữ chiều cao cố định của ảnh
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
      {/* Phần chứa tên sản phẩm và giá */}
      <div
        style={{
          textAlign: "center",
          transition: "opacity 0.3s ease-in-out",
          opacity: hovered ? 0 : 1, // Ẩn khi hover
          height: hovered ? "0px" : "auto",
          overflow: "hidden",
          minHeight: "50px", // Giữ khoảng trống cố định để tránh dịch chuyển
        }}
      >
        <Meta 
          title={product.name} 
          description={<strong style={{ color: "#e60000", fontSize: "16px" }}>{product.price}</strong>} 
        />
      </div>

      {/* Nút CTA - Chỉ hiển thị khi hover */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "opacity 0.3s ease-in-out",
          opacity: hovered ? 1 : 0, // Chỉ hiện khi hover
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
  );
};

export default CardProduct;
