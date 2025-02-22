import React, { useEffect, useState } from "react";
import { Checkbox, Pagination } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import api from "../../../config/api";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState(false);
  const [boxes, setBoxes] = useState([]);

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

  if (!boxes) {
    return <div>Loading...</div>;
  }

  const brandsList = Array.from(
    new Set(boxes.map((product) => product.brandName))
  );

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * 1;
  const currentProducts = boxes.slice(startIndex, startIndex + 9);
  3;
  return (
    <div className="mt-34 container mx-auto">
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div
          style={{
            minWidth: "250px",
            position: "sticky",
            top: "100px",
            marginRight: "20px",
          }}
        >
          <h3>Brand</h3>
          <Checkbox.Group
            style={{ display: "flex", flexDirection: "column" }}
            options={brandsList.map((brand) => ({
              label: brand,
              value: brand,
            }))}
            onChange={handleBrandChange}
          />
        </div>
        <div style={{ flex: 1, paddingLeft: "0px" }}>
          <h2 style={{ marginBottom: "10px" }}>BLIND BOX</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            {currentProducts
              .filter(
                (product) =>
                  brands.length === 0 || brands.includes(product.brandName)
              )
              .map((product) => (
                <div
                  key={product.boxId}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "260px",
                    height: "350px",
                  }}
                >
                  <CardProduct
                    product={product}
                    cardStyle={{ width: "100%", height: "100%" }}
                  />
                </div>
              ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={9}
              total={boxes.length}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
