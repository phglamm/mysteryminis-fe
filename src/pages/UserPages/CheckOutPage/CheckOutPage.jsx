import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Table, Badge, Select, Radio } from "antd";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../../Redux/features/cartSlice";
import { selectUser } from "../../../Redux/features/counterSlice";
import api from "../../../config/api";
import { useNavigate } from "react-router-dom";
import { route } from "../../../routes";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";

const CheckOutPage = () => {
  const [discountCode, setDiscountCode] = useState("");
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const user = useSelector(selectUser);

  const [form] = useForm();
  const [shippingFee, setShippingFee] = useState(0);

  const provisional = cartItems.reduce(
    (acc, item) => acc + item.selectedOption.displayPrice * item.quantity,
    0
  );

  const totalAmount =
    cartItems.reduce(
      (acc, item) => acc + item.selectedOption.displayPrice * item.quantity,
      0
    ) + shippingFee;

  const [userAddress, setUserAddress] = useState([]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await api.get(`/Address/?userId=${user.userId}`);
        console.log(response.data);
        setUserAddress(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchUserAddress();
  }, []);

  const handleAddressChange = (value) => {
    const selectedAddress = userAddress.find(
      (address) => address.addressId === value
    );
    if (selectedAddress) {
      form.setFieldsValue({
        province: selectedAddress.province,
        district: selectedAddress.district,
        addressDetail: selectedAddress.addressDetail,
        ward: selectedAddress.ward,
        phoneNumber: selectedAddress.phoneNumber,
        name: selectedAddress.name,
      });
    }
    handleCalculateShippingFee(selectedAddress);
  };
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const handleCalculateShippingFee = async (selectedAddress) => {
    console.log(selectedAddress);
    const shippingFeeRequest = {
      service_id: 53320,
      to_district_id: selectedAddress.districtId,
      weight: 500 * totalQuantity,
    };
    console.log(shippingFeeRequest);
    try {
      const response = await api.post("Shipping/fee", shippingFeeRequest);
      console.log(response.data);
      setShippingFee(response.data.data.total);
    } catch (error) {
      setShippingFee(40000);
      console.log(error.response.data);
    }
  };

  const handleCheckout = async (values) => {
    values.userId = user.userId;
    values.totalPrice = provisional; // Tổng tiền
    values.shippingFee = shippingFee;
    values.voucherId = 1;
    values.orderItemRequestDto = cartItems.map((item) => ({
      quantity: item.quantity,
      price: item.selectedOption.displayPrice,
      boxOptionId: item.selectedOption.boxOptionId,
      originPrice: item.selectedOption.originPrice,
      isOnlineSerieBox: item.selectedOption.isOnlineSerieBox,
      userRolledItemId: item.selectedOption.userRolledItemId,
      orderItemOpenRequestNumber: item.orderItemOpenRequestNumber,
    }));
    if (
      values.paymentMethod === "COD" &&
      values.orderItemRequestDto.some(
        (item) => item.orderItemOpenRequestNumber > 0
      )
    ) {
      toast.error("COD payment method is not available for open blindbox");
      return;
    }
    console.log(values);
    if (values.paymentMethod === "VNPAY") {
      try {
        const response = await api.post("/Payment/make-Payment", values);
        console.log(response.data);
        window.location.assign(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    } else if (values.paymentMethod === "COD") {
      try {
        const response = await api.post("/Payment/make-Payment", values);
        console.log(response.data);
        navigate(route.orderSuccess);
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "start",
          }}
        >
          <Badge count={record.quantity} style={{ backgroundColor: "#f5222d" }}>
            <img
              src={record.boxImage[0].boxImageUrl}
              alt={record.boxName}
              width="50"
              height="50"
              style={{ borderRadius: "5px" }}
            />
          </Badge>
          <p>
            {record.boxName}
            <p>option: {record.selectedOption.boxOptionName}</p>
            {record.orderItemOpenRequestNumber ? (
              <>Open {record.orderItemOpenRequestNumber} boxes </>
            ) : (
              <></>
            )}
          </p>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (text, record) =>
        `${(
          record.selectedOption.displayPrice * record.quantity
        ).toLocaleString()}₫`, // Tính giá theo số lượng
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
    <div
      className="mt-30"
      style={{
        display: "flex",
        gap: "20px",
        paddingLeft: "10%",
        paddingRight: "10%",
        marginBottom: "5%",
      }}
    >
      {/* Customer Information Form */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontWeight: "semibold", marginBottom: "2%" }}>
          Billing Information
        </h1>
        <Form
          layout="vertical"
          onFinish={handleCheckout}
          form={form}
          requiredMark={false}
        >
          <Form.Item
            name="addressId"
            rules={[{ required: true, message: "Please Select Address" }]}
          >
            <Select
              size="large"
              placeholder="Select Address"
              onChange={handleAddressChange}
            >
              {userAddress.map((address, index) => (
                <Select.Option value={address.addressId} key={index}>
                  {address.name}, {address.phoneNumber}, {address.addressDetail}
                  , {address.ward}, {address.district}, {address.province}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name">
            <Input
              placeholder="Enter your full name"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              disabled
            />
          </Form.Item>

          <Form.Item name="phoneNumber">
            <Input
              placeholder="Enter your phone number"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              disabled
            />
          </Form.Item>

          <Form.Item name="addressDetail">
            <Input
              placeholder="Enter your shipping address"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              disabled
            />
          </Form.Item>

          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Item style={{ flex: 1 }} name="province">
              <Input
                placeholder="Enter city/province"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                disabled
              />
            </Form.Item>

            <Form.Item style={{ flex: 1 }} name="district">
              <Input
                placeholder="Enter district"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                disabled
              />
            </Form.Item>

            <Form.Item style={{ flex: 1 }} name="ward">
              <Input
                placeholder="Enter ward"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                disabled
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button onClick={() => navigate(route.userProfile)}>
              Edit address
            </Button>
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="Payment method"
            rules={[
              { required: true, message: "Please select a payment method!" },
            ]}
          >
            <Radio.Group>
              <Radio value="COD">Cash on Delivery</Radio>
              <Radio value="VNPAY">VNPAY</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Notes (optional)">
            <Input.TextArea
              placeholder="Enter any additional notes for your order"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </Form.Item>

          <Button
            block
            style={buttonStyle}
            onMouseEnter={(e) =>
              Object.assign(e.target.style, buttonHoverStyle)
            }
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
            htmlType="submit"
          >
            Process to Payment
          </Button>
        </Form>
      </div>

      {/* Order Summary */}
      <div style={{ width: "550px" }}>
        <Card title={`Order Summary (${cartItems.length} items)`}>
          <Table
            dataSource={cartItems}
            columns={columns}
            pagination={false}
            showHeader={false}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Enter discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
          <Button
            block
            style={buttonStyle}
            onMouseEnter={(e) =>
              Object.assign(e.target.style, buttonHoverStyle)
            }
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Apply
          </Button>
          <div style={{ marginTop: "15px", fontSize: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>{provisional.toLocaleString()}₫</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              <span>Shipping Fee</span>
              <span>{shippingFee.toLocaleString()} đ</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              <span>Total</span>
              <span>{totalAmount.toLocaleString()}₫</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CheckOutPage;
