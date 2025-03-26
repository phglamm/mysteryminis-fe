import { useEffect, useState } from "react";
import { Checkbox, Pagination, Spin } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import TiltedCard from "../../../components/React_Bits/TiltedCard/TiltedCard";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const location = useLocation();

  let SelectedBrand = location.state?.brand;
  let searchBoxName = location.state?.boxName;
  console.log("Selected Brand: ", SelectedBrand);
  console.log("Selected Box Name: ", searchBoxName);
  // Get boxes from Redux
  const { data: boxes } = useSelector((state) => state.boxes);
  console.log("Boxes: ", boxes);

  useEffect(() => {
    if (SelectedBrand) {
      setBrands([SelectedBrand]);
      window.scrollTo(0, 550);
    }
    else {
      window.scrollTo(0, 0);
    }
  }, [SelectedBrand]);


  const brandsList = Array.from(
    new Set(boxes.map((product) => product.brandName))
  );

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
    setCurrentPage(1); // Reset to page 1 when filtering
    window.scrollTo(0, 550);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 550);
  };

  // Filter products by selected brands
  const filteredProducts = boxes.filter(
    (product) =>
      (brands.length === 0 || brands.includes(product.brandName)) &&
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
    <div className="container pb-[4%] mx-auto mt-[10%]">
      <TiltedCard
        imageSrc="https://global-static.popmart.com/globalAdmin/1740726833285____pc-buy____.jpg?x-oss-process=image/format,webp"
        captionText="Welcome to Mystery Minis"
        containerHeight="500px"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={1}
        scaleOnHover={1}
        showMobileWarning={true}
        showTooltip={true}
      />
      <h4 className="text-5xl font-bold text-center mt-10">
        Our Blindbox Collection
      </h4>
      <div className="mt-[5%]">
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {/* Sidebar */}
          <div
            style={{
              minWidth: "250px",
              position: "sticky",
              top: "140px",
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
    </div>
  );
};

export default ProductPage;
