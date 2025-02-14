import { Button } from "antd";
import { useState } from "react";

const ProductDetailPage = () => {
  const [selectedSize, setSelectedSize] = useState("Still On The Job");
  const [isOutOfStock, setIsOutOfStock] = useState(true);

  const product = {
    name: "SKULLPANDA Tell Me What You Want Series Crossbody Bag",
    price: "600.000 đ",
    brand: "POP MART",
    sizes: [
      { name: "Still On The Job", dimensions: "21*24cm" },
      { name: "Jingle All the Way", dimensions: "19*26cm" }
    ],
    images: [
      "https://prod-hk.oss-eu-central-1.aliyuncs.com/default/20241107_102350_385156____2_____1200x1200.jpg?x-oss-process=image/format,webp",
      "https://prod-hk.oss-eu-central-1.aliyuncs.com/default/20241107_102350_385156____2_____1200x1200.jpg?x-oss-process=image/format,webp",

      "/images/bag3.png",
      "/images/bag4.png"
    ]
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
      {/* Left: Image Section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        />
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Thumbnail"
              style={{ width: "80px", height: "80px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", opacity: "0.9", transition: "opacity 0.3s" }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "0.9")}
            />
          ))}
        </div>
      </div>
      
      {/* Right: Product Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>{product.name}</h1>
        <p style={{ fontSize: "20px", color: "#e60000", fontWeight: "bold" }}>{product.price}</p>

        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#555" }}>SIZE</h3>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {product.sizes.map((size) => (
              <button
                key={size.name}
                style={{ padding: "10px 16px", border: "1px solid #ccc", borderRadius: "8px", fontSize: "14px", cursor: "pointer", backgroundColor: selectedSize === size.name ? "#007BFF" : "#f0f0f0", color: selectedSize === size.name ? "#fff" : "#333" }}
                onClick={() => setSelectedSize(size.name)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Button style={{ width: "100%", padding: "12px", fontSize: "16px", fontWeight: "500", borderRadius: "8px", backgroundColor: isOutOfStock ? "#ccc" : "#007BFF", color: "#fff" }} disabled={isOutOfStock}>
            {isOutOfStock ? "NOTIFY ME WHEN AVAILABLE" : "ADD TO CART"}
          </Button>
        </div>

        <div style={{ paddingTop: "16px", borderTop: "1px solid #ddd" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>Details</h3>
          <p style={{ color: "#555" }}><strong>Brand:</strong> {product.brand}</p>
          <p style={{ color: "#555" }}>
            <strong>Size:</strong> {selectedSize === "Still On The Job" ? "21*24cm" : "19*26cm"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
