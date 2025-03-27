import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Form,
  message,
  Switch,
  Tooltip,
  Spin,
} from "antd";
import api from "../../../config/api";

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalViewContent, setIsModalViewContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await api.get("Feedback");
      const data = await response.data;
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to fetch feedbacks: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  //   const [isModalVisible, setIsModalVisible] = useState(false);
  //   const [editingFeedback, setEditingFeedback] = useState(null);
  //   const [form] = Form.useForm();

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this feedback?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          // Make DELETE request to the API to delete the feedback
          const response = await api.delete(`Feedback/${id}`);

          if (response.status === 200) {
            // Filter out the deleted feedback from the state
            setFeedbacks(
              feedbacks.filter((feedback) => feedback.feedbackId !== id)
            );
            message.success("Feedback deleted successfully");
          }
        } catch (error) {
          console.error("Error deleting feedback:", error);
          message.error("Failed to delete feedback");
        }
      },
    });
  };
  const showViewContent = (text) => {
    setIsModalViewContent(true);
    console.log(text);
    setSelectedContent(text);
  };
  const columns = [
    { title: "ID", dataIndex: "feedbackId", key: "feedbackId", width: 80 },
    {
      title: "Feedback Content",
      dataIndex: "feedbackContent",
      key: "feedbackContent",
      width: 300,
      // render: (text) => {
      //   const truncatedText =
      //     text.length > 10 ? `${text.substring(0, 80)}...` : text;
      //   return (
      //     <Tooltip title={text}>
      //       <span className="feedback-content-tooltip">{truncatedText}</span>
      //     </Tooltip>
      //   );
      // },
      render: (text) => (
        <>
          <Button onClick={() => showViewContent(text)}> View Content</Button>
        </>
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      filters: [
        ...Array.from(
          new Set(feedbacks.map((feedback) => feedback.userName))
        ).map((userName) => ({
          text: userName,
          value: userName,
        })),
      ],
      onFilter: (value, record) => record.userName === value,
      filterSearch: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      filters: [
        ...Array.from(new Set(feedbacks.map((feedback) => feedback.email))).map(
          (email) => ({
            text: email,
            value: email,
          })
        ),
      ],
      onFilter: (value, record) => record.email === value,
      filterSearch: true,
    },
    { title: "Rating", dataIndex: "rating", key: "rating", width: 100 },
    {
      title: "Box Option Name",
      dataIndex: "boxOptionName",
      key: "boxOptionName",
      width: 150,
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => (
        <img
          src={text}
          alt="Feedback Image"
          style={{ width: "50px", height: "50px" }}
        />
      ),
      width: 100,
    },
    {
      title: "Box Option ID",
      dataIndex: "boxOptionId",
      key: "boxOptionId",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (record) => (
        <Space>
          <Button
            type="default"
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
            }}
            onClick={() => handleDelete(record.feedbackId)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ fontSize: "30px" }}>Manage Feedback</h2>
      <div style={{ minHeight: "500px" }}>
        <Table
          columns={columns}
          dataSource={feedbacks}
          scroll={{ y: "calc(100vh - 300px)" }} // Keeps fixed height
        />

        <Modal
          visible={isModalViewContent}
          title="Feedback Content"
          onCancel={() => setIsModalViewContent(false)}
          footer={null}
        >
          <p>{selectedContent}</p>
        </Modal>
      </div>
    </div>
  );
};

export default ManageFeedback;
