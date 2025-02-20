import React, { useState } from "react";
import { Button, Card, Row, Col, InputNumber, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "SKULLPANDA Tell Me What You Want Series Figure - Blinbox",
      price: 300000,
      quantity: 1,
      imageUrl: "https://prod-eurasian-res.popmart.com/default/20241105_155024_141394____8_____1200x1200.jpg?x-oss-process=image/format,webp",
    },
    {
      id: 2,
      name: "SKULLPANDA Tell Me What You Want Series Figure - Blinbox",
      price: 300000,
      quantity: 1,
      imageUrl: "https://prod-eurasian-res.popmart.com/default/20241105_155024_141394____8_____1200x1200.jpg?x-oss-process=image/format,webp",
    },
  ]);

  const handleQuantityChange = (id, value) => {
    const newItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: value } : item
    );
    setCartItems(newItems);
  };

  const handleRemoveItem = (id) => {
    const newItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newItems);
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "20px" }} className="mt-24">
      <Title level={3}>Giỏ Hàng</Title>
      <Row gutter={16}>
        {cartItems.map((item) => (
          <Col span={24} key={item.id}>
            <Card
              style={{
                marginBottom: "10px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              cover={
                <img
                  alt={item.name}
                  src={item.imageUrl}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              }
            >
              <div style={{ marginLeft: "20px", flex: 1 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={5}>{item.name}</Title>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      danger
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Xoá
                    </Button>
                  </Col>
                </Row>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text>{item.price.toLocaleString()}đ</Text>
                  </Col>
                  <Col>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.id, value)}
                      style={{ width: "100px" }}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
<div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={4}>Tổng Tiền</Title>
        <Title level={4}>{totalAmount.toLocaleString()}đ</Title>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
          Thanh Toán
        </Button>
        <Button size="large">Tiếp Tục Mua Sắm</Button>
      </div>
      </div>
    </div>
  );
};

export default Cart;
