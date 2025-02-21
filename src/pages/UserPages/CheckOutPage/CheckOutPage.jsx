import React, { useState } from "react";
import { Form, Input, Button, Card, Table, Checkbox, Badge } from "antd";

const CheckOutPage = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [total, setTotal] = useState(280000 * 2); // Default price with quantity

  const dataSource = [
    {
      key: "1",
      product: "Heyone MINI-HUNT STAR MAP",
      price: 280000, // Giá 1 sản phẩm
      quantity: 2, // Số lượng sản phẩm
      image: "https://down-vn.img.susercontent.com/file/cn-11134207-7ras8-m4inlpil690n72",
    },
  ];

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Badge count={record.quantity} style={{ backgroundColor: "#f5222d" }}>
            <img src={record.image} alt={record.product} width="50" height="50" style={{ borderRadius: "5px" }} />
          </Badge>
          <span>{record.product}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (text, record) => `${(record.price * record.quantity).toLocaleString()}₫`, // Tính giá theo số lượng
    },
  ];

  const inputStyle = {
    height: "50px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    transition: "border 0.3s ease, box-shadow 0.3s ease",
  };

  const inputFocusStyle = {
    borderColor: "#BB7B85",
    boxShadow: "0 0 5px rgba(233, 30, 99, 0.5)",
  };

  const buttonStyle = {
    backgroundColor: "#313857",
    border: "none",
    height: "50px",
    fontSize: "16px",
    color: "white",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#495a72",
  };

  return (
    <div className="mt-30" style={{ display: "flex", gap: "20px", paddingLeft: "10%", paddingRight: "10%", marginBottom: "5%" }}>
      {/* Customer Information Form */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontWeight: "semibold", marginBottom:"2%" }}>Billing Information</h1>
        <Form layout="vertical">
          <Form.Item name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input placeholder="Enter your email" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </Form.Item>

          <Form.Item name="name" rules={[{ required: true, message: "Please enter your full name!" }]}>
            <Input placeholder="Enter your full name" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </Form.Item>

          <Form.Item name="phone" rules={[{ required: true, message: "Please enter your phone number!" }]}>
            <Input placeholder="Enter your phone number" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </Form.Item>

          <Form.Item name="address" rules={[{ required: true, message: "Please enter your address!" }]}>
            <Input placeholder="Enter your shipping address" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </Form.Item>

          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Item style={{ flex: 1 }}>
              <Input placeholder="Enter city/province" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </Form.Item>

            <Form.Item style={{ flex: 1 }}>
              <Input placeholder="Enter district" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </Form.Item>

            <Form.Item style={{ flex: 1 }}>
              <Input placeholder="Enter ward" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
            </Form.Item>
          </div>

          <Form.Item>
            <Checkbox>Save address</Checkbox>
          </Form.Item>

          <Form.Item label="Notes (optional)">
            <Input.TextArea placeholder="Enter any additional notes for your order" style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          </Form.Item>

          <Button block style={buttonStyle} onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}>
            Continue to Shipping Method
          </Button>
        </Form>
      </div>

      {/* Order Summary */}
      <div style={{ width: "350px" }}>
        <Card title="Order Summary (1 item)">
          <Table dataSource={dataSource} columns={columns} pagination={false} showHeader={false} style={{ marginBottom: "10px" }} />
          <Input placeholder="Enter discount code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
          <Button block style={buttonStyle} onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyle)} onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}>
            Apply
          </Button>
          <div style={{ marginTop: "15px", fontSize: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
              <span>Shipping Fee</span>
              <span>-</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontWeight: "bold", fontSize: "18px" }}>
              <span>Total</span>
              <span>{total.toLocaleString()}₫</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckOutPage;
