import React, { useEffect, useState } from "react";
import { Checkbox, Pagination } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import api from "../../../config/api";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [boxes, setBoxes] = useState([]);
  const pageSize = 9;

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const response = await api.get("Box");
        console.log("API Response: ", response.data);

        if (Array.isArray(response.data)) {
          const sortResponse = response.data.sort((a, b) => b.boxId - a.boxId);
          setBoxes(sortResponse);
        } else {
          console.error("API response is not an array: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchBox();
  }, []);

  if (!boxes.length) {
    return <div>Loading...</div>;
  }

  const brandsList = Array.from(
    new Set(boxes.map((product) => product.brandName))
  );

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter products by selected brands
  const filteredProducts = boxes.filter(
    (product) => brands.length === 0 || brands.includes(product.brandName)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="container mx-auto mt-34">
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div
          style={{
            minWidth: "250px",
            position: "sticky",
            top: "100px",
            marginRight: "20px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Filter by Brand</h3>
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            options={brandsList.map((brand) => ({
              label: brand,
              value: brand,
            }))}
            onChange={handleBrandChange}
          />
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, paddingLeft: "0px" }}>
          <h2 style={{ marginBottom: "20px", textAlign: "flex-start" }}>
            BLIND BOX
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            {currentProducts.map((product) => (
              <div
                key={product.boxId}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <CardProduct
                  product={product}
                  cardStyle={{ width: "100%", height: "100%" }}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
