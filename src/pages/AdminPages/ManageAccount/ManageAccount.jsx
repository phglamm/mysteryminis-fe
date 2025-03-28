import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Form,
  Tabs,
  Select,
  Spin,
  Switch,
  Upload,
  Image,
  Dropdown,
  Menu,
  Tag,
} from "antd";
import {
  getAllUsers,
  registerAccount,
  updateAccount,
  updateAccountStatus,
} from "../../../services/AdminServices/ManageAccountServices/ManageAccountServices";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/UploadImage";
import toast from "react-hot-toast";

const { TabPane } = Tabs;

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("User");
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);

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
  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAdd = () => {
    setEditingAccount(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingAccount(record);
    formUpdate.setFieldsValue({
      ...record,
      phoneNumber: record.phone,
    });
    setIsModalUpdateVisible(true);
  };

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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({ fileList: newFileList }) => {
    console.log("uploading...");
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

  const handleSave = async (values) => {
    const imgURLs = fileList.map((file) => file.url);
    values.avatarUrl = imgURLs[0];

    try {
      const response = await registerAccount(values);
      console.log(response.data);
      toast.success("Create Account Success");
      fetchAccounts();
      setIsModalVisible(false);
      setFileList([]);
      form.resetFields();
    } catch (error) {
      error.response.data.message.forEach((msg) => toast.error(msg.description));
      console.log(error.response.data);
    }
  };

  const handleEditProfile = async (values) => {
    const imgURLs = fileList.map((file) => file.url);
    if (imgURLs.length > 0) {
      values.avatarUrl = imgURLs[0];
    } else {
      values.avatarUrl = editingAccount.avatarUrl;
    }
    values.phone = values.phoneNumber;

    try {
      const response = await updateAccount(values);
      console.log(response.data);
      toast.success("Update Account Success");
      fetchAccounts();
      setIsModalUpdateVisible(false);
      setFileList([]);
      formUpdate.resetFields();
    } catch (error) {
      toast.error("Update Account Failed");
      console.log(error.response.data);
    }
  };

  const showConfirmStatusChange = (record) => {
    Modal.confirm({
      title: record.isActive
        ? "Do you want to ban this user?"
        : "Do you want to unban this user?",
      onOk: async () => {
        try {
          await updateAccountStatus(record.userId, !record.isActive);
          toast.success("Status updated successfully");
          fetchAccounts(); // reload list
        } catch (error) {
          toast.error("Failed to update status");
        }
      },
      okText: "Yes",
      cancelText: "No",
    });
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
  width: 120,
  render: (isActive) => (
    <Tag color={isActive ? "green" : "red"}>
      {isActive ? "Active" : "Inactive"}
    </Tag>
  ),
},
    {
      title: "Action",
      key: "action",
      width: 180,
      render: (record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="update" onClick={() => handleEdit(record)}>
                Update
              </Menu.Item>
              <Menu.Item
                key="toggleStatus"
                onClick={() => showConfirmStatusChange(record)}
              >
                {record.isActive ? "Ban User" : "Unban User"}
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button>
            ...
          </Button>
        </Dropdown>
      ),
    }
    
  ];

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
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
        title={"Create Account"}
        open={isModalVisible}
        onOk={() => form.submit()}
        okText="Create"
        cancelText="Cancel"
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
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="avatarURL" label="Avatar">
            <Upload
              className="label-form-image"
              maxCount={1}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
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
            name="phoneNumber"
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

      <Modal
        title={"Edit Account"}
        open={isModalUpdateVisible}
        okText="Update"
        cancelText="Cancel"
        onOk={() => formUpdate.submit()}
        onCancel={() => setIsModalUpdateVisible(false)}
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
        <Form form={formUpdate} layout="vertical" onFinish={handleEditProfile}>
          <Form.Item name="avatarURL" label="Avatar">
            <Upload
              className="label-form-image"
              maxCount={1}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
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
            name="phoneNumber"
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
