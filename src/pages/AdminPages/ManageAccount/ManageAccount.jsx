import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Form,
  message,
  Tabs,
  Select,
  Spin,
  Switch,
  Upload,
  Image,
} from "antd";
import { getAllUsers, registerAccount, updateAccount } from "../../../services/AdminServices/ManageAccountServices/ManageAccountServices";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/UploadImage";

const { TabPane } = Tabs;

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("User");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingAccount(record);
    form.setFieldsValue(record); // Pre-fill the form with current values
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingAccount(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
  
      let avatarUrl = "";
  
      // Kiểm tra xem có tệp avatar mới không
      const uploadField = form.getFieldValue("avatarUrl");
  
      if (uploadField && Array.isArray(uploadField) && uploadField.length > 0) {
        const file = uploadField[0].originFileObj;
        avatarUrl = await uploadFile(file); // Tải avatar lên nếu có tệp
      } else {
        // Nếu không có avatar mới, sử dụng avatar cũ (hoặc để trống nếu không có)
        avatarUrl = editingAccount?.avatarUrl || "";  
      }
  
      const payload = {
        userId: editingAccount ? editingAccount.userId : 0,
        username: values.username,
        fullname: values.fullname,
        phone: values.phone,
        email: values.email,
        gender: values.gender,
        avatarUrl: avatarUrl,  // Sử dụng avatarUrl đã xác định
      };
  
      if (!editingAccount) {
        // Tạo tài khoản mới nếu chưa chỉnh sửa tài khoản cũ
        await registerAccount(payload);
        message.success("Account created successfully");
      } else {
        // Cập nhật tài khoản nếu đang chỉnh sửa tài khoản cũ
        await updateAccount(payload);
        message.success("Account updated successfully");
      }
  
      setIsModalVisible(false);
      fetchAccounts(); // Lấy lại danh sách tài khoản
    } catch (error) {
      console.error("Account save failed:", error);
      message.error("Failed to save account");
    }
  };
  
  

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      width: 80,
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      width: 80,
      render: (url) =>
        url ? (
          <Image
            src={url}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        ) : (
          "No Avatar"
        ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (text ? "Male" : "Female"),
      width: 100,
    },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
      render: (text) => {
        if (text === 1) return "Admin";
        if (text === 2) return "Staff";
        return "User";
      },
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (text) => (text ? "Active" : "Inactive"),
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (record) => (
        <Space>
          <Button
            type="primary"
            style={{
              backgroundColor: "#313857",
              borderColor: "#FFF1F2",
              color: "#FFF1F2",
            }}
            onClick={() => handleEdit(record)}
          >
            Update
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
      <h2 style={{ fontSize: "30px" }}>Manage Accounts</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="User" key="User">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#313857 ",
              borderColor: "#FFF1F2 !important",
              color: "#FFF1F2 !important",
            }}
            onClick={handleAdd}
          >
            Create Account
          </Button>
          <div style={{ minHeight: "500px" }}>
            <Table
              columns={columns}
              dataSource={accounts.filter((account) => account.roleId === 3)}
              scroll={{ y: "calc(100vh - 300px)" }}
            />
          </div>
        </TabPane>

        <TabPane tab="Staff" key="Staff">
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#313857",
              borderColor: "#FFF1F2",
              color: "#FFF1F2",
            }}
            onClick={handleAdd}
          >
            Create Account
          </Button>
          <div style={{ minHeight: "500px" }}>
            <Table
              columns={columns}
              dataSource={accounts.filter((account) => account.roleId === 2)}
              scroll={{ y: "calc(100vh - 300px)" }}
            />
          </div>
        </TabPane>
      </Tabs>

      <Modal
        title={editingAccount ? "Edit Account" : "Create Account"}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{
          style: {
            backgroundColor: "#313857",
            borderColor: "#FFF1F2",
            color: "#FFF1F2",
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: "#FF4D4F",
            borderColor: "#FF4D4F",
            color: "#FFF",
          },
        }}
      >
        <Form form={form} layout="vertical">

        <Form.Item
  name="avatarUrl"
  label="Avatar"
  valuePropName="fileList"
  getValueFromEvent={(e) => {
    // Đảm bảo fileList luôn là một mảng (hoặc mảng rỗng nếu không có tệp)
    return Array.isArray(e) ? e : e?.fileList || [];
  }}
>
  <Upload
    listType="picture"
    maxCount={1}
    beforeUpload={(file) => {
      console.log('File selected:', file);
      return false; // Ngừng tự động tải lên, để bạn có thể xử lý thủ công
    }}
  >
    <Button icon={<UploadOutlined />}>Upload Avatar</Button>
  </Upload>
</Form.Item>



          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input />
          </Form.Item>

          {!editingAccount && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="fullname"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select>
              <Select.Option value={true}>Male</Select.Option>
              <Select.Option value={false}>Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select>
              <Select.Option value={1}>Admin</Select.Option>
              <Select.Option value={2}>Staff</Select.Option>
              <Select.Option value={3}>User</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isTestAccount"
            label="Test Account?"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAccount;
