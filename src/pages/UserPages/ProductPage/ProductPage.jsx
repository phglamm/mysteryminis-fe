import { useEffect, useState } from "react";
import { Checkbox, Pagination, Spin } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import api from "../../../config/api";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  let SelectedBrand = location.state?.brand;
  console.log("Selected Brand: ", SelectedBrand);  
  
    // Get boxes from Redux
    const { data: boxes } = useSelector((state) => state.boxes);
    console.log("Boxes: ", boxes);
    

  
  useEffect(() => {
    if (SelectedBrand) {
      setBrands([SelectedBrand]);
    }
  }, [SelectedBrand]);

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
  
  if (!boxes.length || loading) {
    return (
      <div className="w-full h-full min-h-screen  flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-[10%]">
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
            value={brands}
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
