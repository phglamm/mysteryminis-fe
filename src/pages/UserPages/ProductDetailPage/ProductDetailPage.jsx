import React, { useState } from "react";
import { Button, Collapse, Row, Col } from "antd";
import ReactImageGallery from "react-image-gallery";
import CardProduct from "../../../components/CardProduct/CardProduct"; // Import CardProduct
import "react-image-gallery/styles/css/image-gallery.css";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState("Still On The Job");
  const [isOutOfStock, setIsOutOfStock] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);


  // Thông tin sản phẩm chính
  const product = {
    name: "SKULLPANDA Tell Me What You Want Series Crossbody Bag",
    price: "600.000 đ",
    brand: "POP MART",
    sizes: [
      { name: "Still On The Job", dimensions: "21*24cm" },
      { name: "Jingle All the Way", dimensions: "19*26cm" },
    ],
    images: [
      {
        original:
          "https://down-vn.img.susercontent.com/file/cn-11134207-7ras8-m2aglu3yooic17",
        thumbnail:
          "https://down-vn.img.susercontent.com/file/cn-11134207-7ras8-m2aglu3yooic17",
      },
      {
        original:
          "https://prod-america-res.popmart.com/default/20241101_115018_852937____skullpanda-tell-me-what-you-want-series-crossbody-bag-jingle-all-the-way-accessories-pop-mart-us-1_____1200x1200.jpg?x-oss-process=image/format,webp",
        thumbnail:
          "https://prod-america-res.popmart.com/default/20241101_115018_852937____skullpanda-tell-me-what-you-want-series-crossbody-bag-jingle-all-the-way-accessories-pop-mart-us-1_____1200x1200.jpg?x-oss-process=image/format,webp",
      },
    ],
  };
  // Danh sách sản phẩm liên quan
  const relatedProducts = [
    {
      name: "Pikacat Figurine - Yellow",
      price: "3.490.000đ",
      image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/image-1729312623540.png?v=1729312629110",
      hoverImage: "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/image-1729312623556.png?v=1729312630210",
      inStock: false, // Hết hàng
    },
    {
      name: "Freeny's Hidden Dissectibles: One Piece",
      price: "2.990.000đ",
      image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/screenshot-2025-01-11-150103.png?v=1736583743830",
      hoverImage: "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/f5326b-41f55cd48127481bb11b847dae593cf8-mv2.png?v=1736583743830",
      inStock: true, // Còn hàng
    },
    {
      name: "SKULLPANDA Dark Series",
      price: "1.990.000đ",
      image: "https://i.ebayimg.com/images/g/p~UAAOSwcpFlq3p1/s-l1200.jpg",
      hoverImage: "https://ae01.alicdn.com/kf/H51c23c653c234b11845382ca5da4c076n.jpg",
      inStock: true,
    },
    {
      name: "Molly Space Traveler",
      price: "2.490.000đ",
      image: "https://prod-america-res.popmart.com/default/20250122_114429_314413____1_____1200x1200.jpg?x-oss-process=image/resize,p_40,format,webp",
      hoverImage: "https://i.ebayimg.com/images/g/hBgAAOSwrk5k7wmj/s-l1200.jpg",
      inStock: false,
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
      {/* Chi tiết sản phẩm */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}
      >
        {/* Hình ảnh */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ReactImageGallery items={product.images} showNav={false} />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#333" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: "20px", color: "#e60000", fontWeight: "bold" }}>
            {product.price}
          </p>

          {/* Kích thước sản phẩm */}
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>
              SIZE
            </h3>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {product.sizes.map((size, index) => (
                <button
                  key={size.name}
                  style={{
                    padding: "10px 16px",
                    border:
                      selectedSize === size.name
                        ? "2px solid black"
                        : "1px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    fontWeight: selectedSize === size.name ? "bold" : "normal",
                    backgroundColor:
                      selectedSize === size.name ? "#fff" : "#f0f0f0",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow:
                      selectedSize === size.name
                        ? "0 0 5px rgba(0,0,0,0.3)"
                        : "none",
                    minWidth: "180px",
                    minHeight: "40px",
                    boxSizing: "border-box",
                  }}
                  onClick={() => setSelectedSize(size.name)}
                >
                  <img
                    src={
                      product.images[index]?.thumbnail ||
                      product.images[0].thumbnail
                    } // ✅ Lấy ảnh tương ứng hoặc ảnh mặc định
                    alt={size.name}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                    }} // Bo góc nhẹ
                  />
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nút CTA */}
          <Button
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "500",
              backgroundColor: isOutOfStock ? "#ccc" : "#007BFF",
              color: "#fff",
              height: "50px",
            }}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "NOTIFY ME WHEN AVAILABLE" : "ADD TO CART"}
          </Button>

          {/* Add to Wishlist Button */}
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: "500",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: isWishlisted ? "#ffebee" : "#fff",
              color: isWishlisted ? "#e60000" : "#313857",
              padding: "10px 16px",
              transition: "all 0.3s",
              width: "40%",
              height: "50px",
            }}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            {isWishlisted ? (
              <HeartFilled style={{ color: "#e60000" }} />
            ) : (
              <HeartOutlined style={{ color: "#ccc" }} />
            )}
            {isWishlisted ? "Đã yêu thích" : "Thêm vào yêu thích"}
          </Button>

          {/* Thông tin chi tiết */}
          <Collapse
            defaultActiveKey={[]}
            style={{
              marginTop: "16px",
              border: "none",
              backgroundColor: "transparent",
            }}
          >
            <Panel style={{ fontSize: "20px" }} header="Details" key="1">
              <p style={{ color: "#555" }}>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p style={{ color: "#555" }}>
                <strong>Size:</strong>{" "}
                {selectedSize === "Still On The Job" ? "21*24cm" : "19*26cm"}
              </p>
            </Panel>
          </Collapse>
        </div>
      </div>

      {/* Danh sách sản phẩm liên quan */}
      <div style={{ marginTop: "50px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "16px",
          }}
        >
          Sản phẩm liên quan
        </h2>
        <Row gutter={[16, 16]}>
          {relatedProducts.map((product, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <CardProduct product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductDetailPage;
