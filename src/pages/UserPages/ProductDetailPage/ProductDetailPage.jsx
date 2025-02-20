import React, { useEffect, useState } from "react";
import { Button, Collapse, Row, Col } from "antd";
import ReactImageGallery from "react-image-gallery";
import CardProduct from "../../../components/CardProduct/CardProduct"; // Import CardProduct
import "react-image-gallery/styles/css/image-gallery.css";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import { useParams } from "react-router-dom";
import "./ProductDetailPage.scss";
const { Panel } = Collapse;

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isOutOfStock, setIsOutOfStock] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [box, setBox] = useState();
  const [relevantBox, setRelevantBox] = useState([]);

  const { id } = useParams();
  useEffect(() => {
    const fetchBoxDetail = async () => {
      const response = await api.get(`Box/withDTO/${id}`);
      console.log(response.data);
      setBox(response.data);
      const defaultOption = response.data.boxOptions.reduce(
        (minOption, option) => {
          return option.displayPrice < minOption.displayPrice
            ? option
            : minOption;
        },
        response.data.boxOptions[0]
      );
      setSelectedSize(defaultOption.boxOptionName);
      setSelectedPrice(defaultOption.displayPrice);
    };
    fetchBoxDetail();
  }, [id]);

  useEffect(() => {
    if (box) {
      const fetchRelevantBox = async () => {
        const response = await api.get(`Box`);
        console.log(response.data);
        const filterResponse = response.data.filter(
          (relevantBox) =>
            relevantBox.brandName === box.brandName &&
            relevantBox.boxId !== box.boxId
        );
        setRelevantBox(filterResponse);
      };
      fetchRelevantBox();
    }
  }, [box]);

  if (!box) {
    return <div>Loading...</div>;
  }

  const product = {
    name: box.boxName,
    brand: box.brandName,
    sizes: box.boxOptions.map((option) => ({
      name: option.boxOptionName,
      displayPrice: option.displayPrice,
    })),
    images: box?.boxImage?.map((image) => ({
      original: image?.boxImageUrl,
      thumbnail: image?.boxImageUrl,
    })),
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size.name);
    setSelectedPrice(size.displayPrice);
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "96px auto",
        padding: "32px",
      }}
      className="product-detail-page"
    >
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
          <ReactImageGallery items={product?.images} showNav={false} />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1 style={{ fontSize: "25px", fontWeight: "bold", color: "#333" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: "20px", color: "#e60000", fontWeight: "bold" }}>
            {formatPrice(selectedPrice)}
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
                  onClick={() => handleSizeChange(size)}
                >
                  <img
                    src={
                      product?.images[index]?.thumbnail ||
                      product?.images[0]?.thumbnail
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
                <strong>Size:</strong> {selectedSize || product.sizes[0].name}
              </p>
            </Panel>
          </Collapse>
        </div>
      </div>

      {/* Danh sách sản phẩm liên quan */}
      {relevantBox.length > 0 && (
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
            {relevantBox.map((product, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
