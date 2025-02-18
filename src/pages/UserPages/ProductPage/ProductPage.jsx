import React from "react";
import { Row, Col } from "antd";
import CardProduct from "../../../components/CardProduct/CardProduct";

const ProductPage = () => {
  // Dữ liệu sản phẩm mẫu
  const products = [
    {
      id: 1,
      name: "NYOTA Growing Up By Your",
      price: "300.000đ",
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
        image:
          "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153818116-f14b0158651fe5f66231df98af874f1a.jpg?v=1739254595240",
        hoverImage:
          "https://bizweb.dktcdn.net/thumb/1024x1024/100/357/932/products/z6307153796265-f263a23ae57d141286886531e1533385.jpg?v=1739254595240",
        inStock: true,
      },
  ];

  return (
    <div className="mt-24">
      <div
        style={{
          maxWidth: "1200px",
          margin: "96px auto",
          padding: "32px",
        }}
      >
        <h2>BLIND BOX</h2>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <CardProduct product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductPage;
