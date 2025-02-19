import React, { useEffect, useState } from "react";
import { Row, Col, Checkbox, Pagination } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import { motion } from "framer-motion";
import api from "../../../config/api";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState(false);

  const [boxes, setBoxes] = useState([]);
  useEffect(() => {
    const fetchBox = async () => {
      const response = await api.get("Box");
      console.log(response.data);
      const sortResponse = response.data.sort((a, b) => b.boxId - a.boxId);
      setBoxes(sortResponse);
    };
    fetchBox();
  }, []);

  const checkboxStyle = {
    borderColor: checked ? "pink" : "#d9d9d9",
    backgroundColor: checked ? "pink" : "transparent",
  };

  const brandsList = Array.from(
    new Set(boxes.map((product) => product.brandName))
  );

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice the products to show only the products for the current page
  const startIndex = (currentPage - 1) * 9;
  const currentProducts = boxes.slice(startIndex, startIndex + 9);

  return (
    <div className="mt-24">
      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "96px auto",
          padding: "32px",
        }}
      >
        <div style={{ marginRight: "24px" }}>
          <h3>Brand</h3>
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              borderColor: checked ? "pink" : "#d9d9d9",
              backgroundColor: checked ? "pink" : "transparent",
            }}
            options={brandsList.map((brand) => ({
              label: brand,
              value: brand,
            }))}
            onChange={handleBrandChange}
          >
            {brandsList.map((brand) => (
              <Checkbox
                checked={checked}
                key={brand}
                style={{
                  borderColor: checked ? "pink" : "#d9d9d9",
                  backgroundColor: checked ? "pink" : "transparent",
                }}
              >
                {brand}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
        <div>
          <h2 style={{ marginBottom: "10px" }}>BLIND BOX</h2>
          <Row
            gutter={[16, 16]}
            justify={currentProducts.length === 1 ? "center" : "start"}
          >
            {currentProducts
              .filter(
                (product) =>
                  brands.length === 0 || brands.includes(product.brandName)
              )
              .map((product) => (
                <Col
                  xs={24}
                  sm={8}
                  md={8}
                  lg={8}
                  span={currentProducts.length === 1 ? 24 : 8}
                  key={product.boxId}
                >
                  <CardProduct product={product} />
                </Col>
              ))}
          </Row>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={currentPage}
              pageSize={9}
              total={boxes.length}
              onChange={handlePageChange}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
