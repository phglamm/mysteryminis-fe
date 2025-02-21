import React, { useState } from "react";
import { Button, Row, Col, Typography, Divider } from "antd";
import { ShoppingCartOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "SKULLPANDA Tell Me What You Want Series Figure - Blindbox",
      price: 300000,
      quantity: 1,
      imageUrl: "https://prod-eurasian-res.popmart.com/default/20241105_155024_141394____8_____1200x1200.jpg?x-oss-process=image/format,webp",
    },
    {
      id: 2,
      name: "SKULLPANDA Tell Me What You Want Series Figure - Blindbox",
      price: 300000,
      quantity: 1,
      imageUrl: "https://prod-eurasian-res.popmart.com/default/20241105_155024_141394____8_____1200x1200.jpg?x-oss-process=image/format,webp",
    },
  ]);

  const handleQuantityChange = (id, value) => {
    const newItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, value) } : item
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
    <div style={{ display: "flex", justifyContent: "center", }} >
      <div style={{ padding: "20px", maxWidth: "90%"}} className="mt-24">
        <Title level={2}>Shopping Cart</Title>
        <Row gutter={24}>
          <Col span={18}>
            {cartItems.map((item, index) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "20px 0" }}>
                <img
                  alt={item.name}
                  src={item.imageUrl}
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <div style={{ marginLeft: "30px", flex: 1 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Title level={3} style={{ fontSize: "18px" }}>{item.name}</Title>
                    </Col>
                    <Col>
                      <Button type="text" danger onClick={() => handleRemoveItem(item.id)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                  <Row justify="space-between" align="middle" style={{ marginTop: "15px" }}>
                    <Col>
                      <Text style={{ fontSize: "18px" }}>{item.price.toLocaleString()}đ</Text>
                    </Col>
                    <Col>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Button 
                          icon={<MinusOutlined />} 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity === 1}
                        />
                        <Text style={{ margin: "0 15px", minWidth: "50px", textAlign: "center", fontSize: "18px" }}>{item.quantity}</Text>
                        <Button 
                          icon={<PlusOutlined />} 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
          </Col>
          <Col span={6} style={{ display: "flex", flexDirection: "column", justifyContent: "center"}}>
            <Title style={{textAlign:"center"}} level={2}>Order Information</Title>
            <hr style={{ margin: "10px 0", border: "1px solid #ddd" }} />
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Title level={4}>Total Amount: </Title>
            <Title style={{marginTop:"0"}} level={4}>{totalAmount.toLocaleString()}đ</Title>
            </div>
            <Button 
  type="primary" 
  icon={<ShoppingCartOutlined />} 
  size="large" 
  style={{ 
    marginTop: "20px", 
    backgroundColor: "#EDBABC",  
    borderColor: "#FFF1F2",  
    color: "#313857", 
    transition: "background 0.3s ease"
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FFF1F2"} 
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EDBABC"} 
>
  Checkout
</Button>

<Button 
  type="default" 
  size="large" 
  style={{ 
    marginTop: "10px", 
    borderColor: "#EDBABC",  
    color: "#313857",  
    backgroundColor: "#FFF1F2", 
    transition: "all 0.3s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#EDBABC";
    e.currentTarget.style.color = "#313857";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "transparent";
    e.currentTarget.style.color = "#313857";
  }}
>
  Continue Shopping
</Button>

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;
