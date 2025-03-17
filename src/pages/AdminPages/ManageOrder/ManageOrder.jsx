import { useState, useEffect } from "react";
import { Table, Button, Space, Tabs, Modal, Upload, Image, Form } from "antd";
import api from "../../../config/api";
import dayjs from "dayjs"; // Import thư viện format ngày giờ
import toast from "react-hot-toast";
import uploadFile from "../../../utils/UploadImage";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
const { TabPane } = Tabs;

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isModalUpload, setIsModalUpload] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formUpload] = useForm();

  const showModalUpload = (item) => {
    setIsModalUpload(true);
    setSelectedItem(item);
  };

  const handleCancelUpload = () => {
    setIsModalUpload(false);
    setSelectedItem(null);
    setFileList([]);
  };
  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };
  const fetchOrders = async () => {
    try {
      const response = await api.get("Order");
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data.orders) {
        setOrders(response.data.orders);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { title: "Order Number", dataIndex: "_id", key: "_id" },
    {
      title: "Date Time",
      dataIndex: "orderCreatedAt",
      key: "orderCreatedAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"), // Format ngày giờ
      sorter: (a, b) =>
        dayjs(b.orderCreatedAt).unix() - dayjs(a.orderCreatedAt).unix(), // Sắp xếp theo ngày mới nhất
    },
    { title: "Customer ID", dataIndex: ["user", "_id"], key: "user._id" },
    {
      title: "Items",
      dataIndex: "orderItems",
      key: "items",
      render: (items) => (items ? items.length : 0),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => price.toLocaleString() + " đ",
    },
    {
      title: "Order Status",
      dataIndex: ["orderStatus", "orderStatusName"],
      key: "orderStatus",
      render: (status) => {
        if (status === "PENDING") {
          return "Pending";
        } else if (status === "PROCESSING") {
          return "Processing";
        } else if (status === "SHIPPING") {
          return "Shipping";
        } else if (status === "CANCELLED") {
          return "Cancelled";
        } else if (status === "ARRIVED") {
          return "Arrived";
        } else {
          return "Unknown";
        }
      },
      filters: [
        {
          text: "Pending",
          value: "PENDING",
        },
        {
          text: "Processing",
          value: "PROCESSING",
        },
        {
          text: "Shipping",
          value: "SHIPPING",
        },
        {
          text: "Cancelled",
          value: "CANCELLED",
        },
        {
          text: "Arrived",
          value: "ARRIVED",
        },
      ],
      onFilter: (value, record) => record.orderStatus.orderStatusName === value,
      filterSearch: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "#313857", color: "#FFF1F2" }}
            onClick={() => showModal(record)}
          >
            View
          </Button>
          {record.orderStatus.orderStatusName === "PROCESSING" ||
          record.orderStatus.orderStatusName === "SHIPPING" ||
          record.orderStatus.orderStatusName === "ARRIVED" ? (
            <>
              <Button
                type="primary"
                style={{ backgroundColor: "#313857", color: "#FFF1F2" }}
                onClick={() => handleUpdatePrevOrderStatus(record)}
              >
                Turn back Order Status
              </Button>
            </>
          ) : (
            <></>
          )}
          {record.orderStatus.orderStatusName === "PROCESSING" ||
          record.orderStatus.orderStatusName === "SHIPPING" ||
          record.orderStatus.orderStatusName === "PENDING" ? (
            <>
              {" "}
              <Button
                type="primary"
                style={{ backgroundColor: "#313857", color: "#FFF1F2" }}
                onClick={() => handleUpdateNextOrderStatus(record)}
              >
                Process Order Status
              </Button>
            </>
          ) : (
            <></>
          )}
        </Space>
      ),
    },
  ];
  const handleUpdatePrevOrderStatus = async (order) => {
    try {
      const response = await api.put(`orderStatus/prev/${order._id}`);
      console.log(response.data);
      fetchOrders();
      toast.success("Update Order Status Success");
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  };
  const handleUpdateNextOrderStatus = async (order) => {
    try {
      const response = await api.put(`orderStatus/next/${order._id}`);
      console.log(response.data);
      fetchOrders();
      toast.success("Update Order Status Success");
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  };
  // Lọc và sắp xếp đơn hàng theo ngày mới nhất
  const filteredData = orders
    .filter((order) => {
      if (activeTab === "All") return true;
      if (activeTab === "Refund") return order.refundRequest;
      if (activeTab === "Cancelled")
        return order.orderStatus.orderStatusName === "CANCELLED";
      if (activeTab === "Arrived")
        return order.orderStatus.orderStatusName === "ARRIVED";
      if (activeTab === "Processing") return order.openRequest === true;
      return false;
    })
    .sort(
      (a, b) => dayjs(b.orderCreatedAt).unix() - dayjs(a.orderCreatedAt).unix()
    ); // Sắp xếp giảm dần

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => {
        console.log(error);
        reject(error);
      };
    });
  };

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList: newFileList }) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.status !== "done") {
          try {
            const url = await uploadFile(file.originFileObj); // Upload the file and get the URL
            toast.success("Upload Success");
            return { ...file, url, status: "done" }; // Update the file status and add the URL
          } catch (error) {
            console.error("Upload failed", error);
            return { ...file, status: "error" }; // Set status to error on failure
          }
        }
        return file; // Keep already uploaded files as-is
      })
    );
    setFileList(updatedFileList);
  };

  const handleUpdateUpload = async (values) => {
    const imgURLs = fileList.map((file) => file.url);
    console.log(imgURLs);
    values.orderStatusCheckCardImage = imgURLs;
    console.log(values);
    try {
      const response = await api.post(
        `orderItem/updateCheckCard/${selectedItem._id}`,
        values
      );
      console.log(response.data);
      setIsModalUpload(false);
      setIsModalVisible(false);
      setFileList([]);
      fetchOrders();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: "30px" }}>Manage Orders</h2>
      <Button
        type="primary"
        style={{
          marginBottom: 16,
          backgroundColor: "#313857",
          color: "#FFF1F2",
        }}
        onClick={fetchOrders}
      >
        Refresh Orders
      </Button>
      <Tabs defaultActiveKey="PROCESSING" onChange={setActiveTab}>
        <TabPane tab="All Order" key="All" />
        <TabPane tab="Processing" key="Processing" />
        <TabPane tab="Arrived" key="Arrived" />
        <TabPane tab="Refund" key="Refund" />
        <TabPane tab="Cancelled" key="Cancelled" />
      </Tabs>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{ pageSize: 10 }} // Phân trang 10 đơn hàng mỗi trang
      />

      <Modal
        width={1000}
        title={`Order Details number ${selectedOrder?._id}`}
        visible={isModalVisible}
        footer={
          <>
            <Button onClick={handleCancel}>Close</Button>
          </>
        }
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Date Time:</strong>{" "}
              {dayjs(selectedOrder.orderCreatedAt).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Customer ID:</strong> {selectedOrder.user._id}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address?.addressDetail},{" "}
              {selectedOrder.address?.district}, {selectedOrder.address?.ward},{" "}
              {selectedOrder.address?.province}
            </p>
            <p>
              <strong>Receiver:</strong> {selectedOrder.address?.name}
            </p>
            <p>
              <strong>Phone Receiver:</strong>{" "}
              {selectedOrder.address?.phoneNumber}
            </p>
            <div className="flex flex-col gap-5">
              {selectedOrder.orderItems?.map((item) => (
                <>
                  <div
                    key={item._id}
                    className="flex justify-between items-center gap-5"
                  >
                    <div className="flex justify-start items-center gap-5">
                      <img
                        src={item.boxOption.box.boxImages[0]?.boxImageUrl}
                        alt=""
                        className="h-20  w-20 border "
                      />
                      <div>
                        <p>Name: {item.boxOption.box.boxName}</p>
                        <p>Option: {item.boxOption.boxOptionName}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div>
                      <p>{item.orderPrice.toLocaleString() + " đ"}</p>
                    </div>
                    {item.openRequestNumber > 0 && (
                      <div>
                        <p> Open request: {item.openRequestNumber}</p>
                        <Button onClick={() => showModalUpload(item)}>
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-10">
                    {item.orderStatusCheckCardImage?.map((img, index) => (
                      <img
                        src={img}
                        alt=""
                        key={index}
                        className="h-40 w-40 "
                      />
                    ))}
                  </div>
                </>
              ))}
            </div>
            <div className="flex flex-col justify-end items-end">
              <p>
                <strong>Total Price:</strong>{" "}
                {selectedOrder.subTotal.toLocaleString()} đ
              </p>
              <p>
                <strong>Shipping Fee:</strong>{" "}
                {selectedOrder.shippingFee.toLocaleString()} đ
              </p>
              <p className="text-lg">
                <strong>Order Total:</strong>{" "}
                {selectedOrder.totalPrice.toLocaleString()} đ
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedOrder.orderStatus.orderStatusName === "PENDING" &&
                  "Pending"}
                {selectedOrder.orderStatus.orderStatusName === "PROCESSING" &&
                  "Processing"}
                {selectedOrder.orderStatus.orderStatusName === "SHIPPING" &&
                  "Shipping"}
                {selectedOrder.orderStatus.orderStatusName === "CANCELLED" &&
                  "Cancelled"}
                {selectedOrder.orderStatus.orderStatusName === "ARRIVED" &&
                  "Arrived"}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={`Order Item number ${selectedItem?._id}`}
        visible={isModalUpload}
        onCancel={handleCancelUpload}
        onOk={() => formUpload.submit()}
        okText="Update"
        cancelText="Close"
      >
        {selectedItem?.openRequestNumber > 0 && (
          <div className="flex justify-end items-end">
            <Form
              layout="vertical"
              form={formUpload}
              onFinish={handleUpdateUpload}
            >
              <Upload
                className="label-form-image"
                // maxCount={selectedItem.openRequestNumber}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {/* {fileList.length >= selectedItem.openRequestNumber
                  ? null
                  : uploadButton} */}
                {uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrder;
