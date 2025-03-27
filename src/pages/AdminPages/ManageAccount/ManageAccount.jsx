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
import {
  getAllUsers,
  registerAccount,
} from "../../../services/AdminServices/ManageAccountServices/ManageAccountServices";
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
    form.setFieldsValue(record);
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
      const uploadField = form.getFieldValue("avatarUrl");
      const fileList = Array.isArray(uploadField)
        ? uploadField
        : uploadField?.fileList;

      if (fileList && fileList.length > 0) {
        const file = fileList[0].originFileObj;
        avatarUrl = await uploadFile(file);
      }

      if (!editingAccount) {
        const payload = {
          email: values.email,
          userName: values.username,
          password: values.password,
          fullName: values.fullname,
          phoneNumber: values.phone,
          gender: values.gender,
          roleId: values.roleId,
          isTestAccount: values.isTestAccount || false,
          avatarUrl: avatarUrl || "",
        };
        console.log(payload);
        await registerAccount(payload);
        message.success("Account created successfully");
        setIsModalVisible(false);
        fetchAccounts();
      } else {
        setAccounts(
          accounts.map((account) =>
            account.userId === editingAccount.userId
              ? { ...account, ...values }
              : account
          )
        );
        message.success("Account updated locally");
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Account save failed:", error);
      const msg =
        error?.response?.data?.[0]?.description ||
        error?.response?.data?.message ||
        "Failed to save account";
      message.error(msg);
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
      filters: [
        ...new Set(
          accounts.map((item) => ({
            text: item.username,
            value: item.username,
          }))
        ),
      ],
      onFilter: (value, record) => record.username === value,
      filterSearch: true,
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
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
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

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
                message:
                  "Password must be at least 8 characters long and include at least 1 uppercase and 1 lowercase letter!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

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
