import React, { useState } from "react";
import { Row, Col, Checkbox, Pagination } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";
import { motion } from "framer-motion";

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState(false);

  const checkboxStyle = {
    borderColor: checked ? "pink" : "#d9d9d9",
    backgroundColor: checked ? "pink" : "transparent", 
  };
  // Dữ liệu sản phẩm mẫu
  const products = [
    {
      id: 1,
      name: "NYOTA Growing Up By Your",
      price: "300.000đ",
      brand: "NYOTA",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/470211240-122196565034224229-1179697226649140363-n.jpg?v=1739167330567",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/470242273-122196564818224229-5587093129055374712-n.jpg?v=1739167357847",
      inStock: true,
    },
    {
      id: 2,
      name: "Crayon Shinchan - Our D",
      price: "200.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6300785112309-002-75999bf1d19c611a0e241b55ef0f4698.jpg?v=1739168540273",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6300785112309-009-eb2c626b9978e78a79970a23f9da7f21.jpg?v=1739168541370",
      inStock: false,
    },
    {
      id: 3,
      name: "Heyone Mini-Hunt Star M",
      price: "280.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307315764325-83a58b1c9df114ee76dc41414fc32d09.jpg?v=1739258037073",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307315815195-eb1bbbc1a5550cd164c14009084e20e2.jpg?v=1739258068927",
      inStock: true,
    },
    {
      id: 4,
      name: "Crayon Shin-Chan Growing Fun Series Plush Blind Box",
      price: "290.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153818116-f14b0158651fe5f66231df98af874f1a.jpg?v=1739254595240",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153796265-f263a23ae57d141286886531e1533385.jpg?v=1739254595240",
      inStock: true,
    },
    {
      id: 5,
      name: "NYOTA Growing Up By Your",
      price: "300.000đ",
      brand: "NYOTA",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/470211240-122196565034224229-1179697226649140363-n.jpg?v=1739167330567",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/470242273-122196564818224229-5587093129055374712-n.jpg?v=1739167357847",
      inStock: true,
    },
    {
      id: 6,
      name: "Crayon Shinchan - Our D",
      price: "200.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6300785112309-002-75999bf1d19c611a0e241b55ef0f4698.jpg?v=1739168540273",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6300785112309-009-eb2c626b9978e78a79970a23f9da7f21.jpg?v=1739168541370",
      inStock: false,
    },
    {
      id: 7,
      name: "Heyone Mini-Hunt Star M",
      price: "280.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307315764325-83a58b1c9df114ee76dc41414fc32d09.jpg?v=1739258037073",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307315815195-eb1bbbc1a5550cd164c14009084e20e2.jpg?v=1739258068927",
      inStock: true,
    },
    {
      id: 8,
      name: "Crayon Shin-Chan Growing Fun Series Plush Blind Box",
      price: "290.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153818116-f14b0158651fe5f66231df98af874f1a.jpg?v=1739254595240",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153796265-f263a23ae57d141286886531e1533385.jpg?v=1739254595240",
      inStock: true,
    },
    {
      id: 9,
      name: "NYOTA Growing Up By Your",
      price: "300.000đ",
      brand: "NYOTA",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/470211240-122196565034224229-1179697226649140363-n.jpg?v=1739167330567",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/470242273-122196564818224229-5587093129055374712-n.jpg?v=1739167357847",
      inStock: true,
    },
    {
      id: 10,
      name: "Crayon Shinchan - Our D",
      price: "200.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6300785112309-002-75999bf1d19c611a0e241b55ef0f4698.jpg?v=1739168540273",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6300785112309-009-eb2c626b9978e78a79970a23f9da7f21.jpg?v=1739168541370",
      inStock: false,
    },
    {
      id: 11,
      name: "Heyone Mini-Hunt Star M",
      price: "280.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307315764325-83a58b1c9df114ee76dc41414fc32d09.jpg?v=1739258037073",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307315815195-eb1bbbc1a5550cd164c14009084e20e2.jpg?v=1739258068927",
      inStock: true,
    },
    {
      id: 12,
      name: "Crayon Shin-Chan Growing Fun Series Plush Blind Box",
      price: "290.000đ",
      brand: "POPMART",
      image:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153818116-f14b0158651fe5f66231df98af874f1a.jpg?v=1739254595240",
      hoverImage:
        "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153796265-f263a23ae57d141286886531e1533385.jpg?v=1739254595240",
      inStock: true,
    },
    // Add more products here for testing pagination
  ];

  const brandsList = Array.from(new Set(products.map((product) => product.brand)));

  const handleBrandChange = (checkedValues) => {
    setBrands(checkedValues);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Slice the products to show only the products for the current page
  const startIndex = (currentPage - 1) * 9;
  const currentProducts = products.slice(startIndex, startIndex + 9);

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
  options={brandsList.map((brand) => ({ label: brand, value: brand }))}
  onChange={handleBrandChange}
>
  {brandsList.map((brand) => (
    <Checkbox
    checked={checked}
      key={brand}
      style={{borderColor: checked ? "pink" : "#d9d9d9",
        backgroundColor: checked ? "pink" : "transparent",}}
    >
      {brand}
    </Checkbox>
  ))}
</Checkbox.Group>

        </div>
        <div>
          <h2 style={{ marginBottom: "10px" }}>BLIND BOX</h2>
          <Row gutter={[16, 16]} justify={currentProducts.length === 1 ? "center" : "start"}>
            {currentProducts
              .filter((product) => brands.length === 0 || brands.includes(product.brand))
              .map((product) => (
                <Col
                  xs={24}
                  sm={8}
                  md={8}
                  lg={8}
                  span={currentProducts.length === 1 ? 24 : 8}
                  key={product.id}
                >
                  <CardProduct product={product} />
                </Col>
              ))}
          </Row>
          <div style={{display:"flex", justifyContent:"center"}}>
          <Pagination
            current={currentPage}
            pageSize={9}
            total={products.length}
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
