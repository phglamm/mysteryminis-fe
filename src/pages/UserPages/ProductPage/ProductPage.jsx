import { useEffect, useState } from "react";
import { Checkbox, Pagination, Spin } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const location = useLocation();

  let SelectedBrand = location.state?.brandName;
  let searchBoxName = location.state?.boxName;
  console.log("Selected Brand: ", SelectedBrand);
  console.log("Selected Box Name: ", searchBoxName);
  // Get boxes from Redux
  const { data: boxes } = useSelector((state) => state.boxes);
  console.log("Boxes: ", boxes);

  useEffect(() => {
    if (SelectedBrand) {
      setBrands([SelectedBrand]);
    }
  }, [SelectedBrand]);

  const brandsList = Array.from(
    new Set(boxes.map((product) => product.brand?.brandName))
  );

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log(brandsList);
  // Filter products by selected brands
  const filteredProducts = boxes.filter(
    (product) =>
      (brands.length === 0 || brands.includes(product.brand?.brandName)) &&
      (!searchBoxName ||
        product.boxName.toLowerCase().startsWith(searchBoxName.toLowerCase()))
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  if (!boxes.length) {
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
              label: brand ? brand : "Unknown",
              value: brand ? brand : "Unknown",
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
                key={product._id}
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
