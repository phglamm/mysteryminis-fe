import {
  Button,
  Dropdown,
  Image,
  Input,
  Menu,
  Modal,
  Select,
  Table,
  Tabs,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import Form from "antd/es/form/Form";
import toast from "react-hot-toast";
import { render } from "@react-three/fiber";
import uploadFile from "../../../utils/UploadImage";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";

export default function ManageBoxOption() {
  const [activeTab, setActiveTab] = useState("1");
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formAddLucky] = Form.useForm();
  const [formUpdateLucky] = Form.useForm();
  const [boxOption, setBoxOption] = useState([]);
  const [luckyBox, setLuckyBox] = useState([]);
  const [box, setBox] = useState([]);

  const fetchBoxOption = async () => {
    const response = await api.get("BoxOption");
    console.log(response.data);
    const sortReponse = response.data.sort(
      (a, b) => b.boxOptionId - a.boxOptionId
    );
    setBoxOption(sortReponse);
  };
  const fetchLuckyBox = async () => {
    try {
      const response = await api.get("online-serie-box");
      console.log(response.data);
      setLuckyBox(
        response.data.sort((a, b) => b.onlineSerieBoxId - a.onlineSerieBoxId)
      );
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const response = await api.get("Box");
        console.log(response.data);
        setBox(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    fetchLuckyBox();
    fetchBoxOption();
    fetchBox();
  }, []);

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxOption, setSelectedBoxOption] = useState(null);

  const handleAdd = async (values) => {
    try {
      const response = await api.post("BoxOption", values);
      setBoxOption([...boxOption, response.data]);
      toast.success("Box's Option added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
    } catch (error) {
      console.error("Failed to add BoxOption:", error);
      toast.error("Failed to add BoxOption");
    }
  };

  const handleModalUpdate = (record) => {
    setSelectedBoxOption(record);
    formUpdate.setFieldsValue({
      ...record,
      BoxId: record.belongBox?.boxId, // Extract boxId from belongBox
    });
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await api.put(
        `BoxOption/${selectedBoxOption.boxOptionId}`,
        values
      );
      console.log(response.data);
      setBoxOption(
        boxOption.map((BoxOption) =>
          BoxOption.boxOptionId === selectedBoxOption.boxOptionId
            ? { ...BoxOption, ...values }
            : BoxOption
        )
      );
      toast.success("Updated successfully");
      fetchBoxOption();
      setIsModalUpdateOpen(false);
      setSelectedBoxOption(null);
    } catch (error) {
      console.error("Failed to update Box's Option:", error);
      toast.error("Failed to update Box's Option");
    }
  };

  const handleDelete = (values) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box's Option?",
      onOk: async () => {
        try {
          await api.delete(`BoxOption/${values.boxOptionId}`);
          toast.success("Box's Option deleted successfully");
          setBoxOption(
            boxOption.filter(
              (BoxOption) => BoxOption.boxOptionId !== values.boxOptionId
            )
          );
          fetchBoxOption();
        } catch (error) {
          toast.error("Failed to delete Box's Option");
        }
      },
    });
  };

  const columnBoxOptions = [
    {
      title: "ID",
      dataIndex: "boxOptionId",
      key: "boxOptionId",
    },
    {
      title: "Name",
      dataIndex: "boxOptionName",
      key: "boxOptionName",
    },
    {
      title: "Cost Price",
      dataIndex: "originPrice",
      key: "originPrice",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Display Price",
      dataIndex: "displayPrice",
      key: "displayPrice",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Stock",
      dataIndex: "boxOptionStock",
      key: "boxOptionStock",
    },
    {
      title: "Status",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (value) => (value ? "Deleted" : "Active"),
    },
    {
      title: "For Box Id",
      dataIndex: ["belongBox", "boxId"],
      key: "boxId",
    },
    {
      title: "For Box Name",
      dataIndex: ["belongBox", "boxName"],
      key: "boxName",
      filters: boxOption
        ? Array.from(
            new Set(boxOption.map((item) => item.belongBox?.boxName))
          ).map((name) => ({ text: name, value: name }))
        : [],
      onFilter: (value, record) => record.belongBox?.boxName === value,
      filterSearch: true,
    },
    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex justify-around items-center">
            <Button onClick={() => handleModalUpdate(record)}>Update</Button>
            <Button onClick={() => handleDelete(record)}>Delete</Button>
          </div>
        </>
      ),
    },
  ];

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
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
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const [isModalAddLuckyOpen, setIsModalAddLuckyOpen] = useState(false);
  const [isModalUpdateLuckyOpen, setIsModalUpdateLuckyOpen] = useState(false);
  const [selectedLuckyBox, setSelectedLuckyBox] = useState(null);

  const columnsLuckyBox = [
    {
      title: "ID",
      dataIndex: "onlineSerieBoxId",
      key: "onlineSerieBoxId",
    },
    {
      title: "First Price",
      dataIndex: "basePrice",
      key: "basePrice",
    },
    {
      title: "Percent Increased per Turn",
      dataIndex: "priceIncreasePercent",
      key: "priceIncreasePercent",
      render: (value) => `${value}%`,
    },
    {
      title: "Price after Open Secret",
      dataIndex: "priceAfterSecret",
      key: "priceAfterSecret",
      render: (value) => value.toLocaleString(),
    },
    {
      title: "Max Turns",
      dataIndex: "maxTurn",
      key: "maxTurn",
    },
    {
      title: "Current Turn",
      dataIndex: "turn",
      key: "turn",
    },
    {
      title: "Secret Open",
      dataIndex: "isSecretOpen",
      key: "isSecretOpen",
      render: (value) => (value ? "Opened" : "Not Yet"),
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (value) => (value ? "Published" : "Unpublished"),
    },
    {
      title: "In Box",
      dataIndex: "isSecretOpen",
      key: "isSecretOpen",
      render: (value) => (value ? "Opened" : "Not Yet"),
    },
    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex justify-around items-center">
            {/* <Button onClick={() => handleModalLuckyUpdate(record)}>
              Update
            </Button>
            <Button>Delete</Button> */}
            <Dropdown overlay={getMenu(record)} trigger={["click"]}>
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        </>
      ),
    },
  ];
  const getMenu = (record) => {
    return (
      <Menu>
        <Menu.Item key="update" onClick={() => handleModalLuckyUpdate(record)}>
          Update
        </Menu.Item>
        <Menu.Item key="delete" onClick={() => handleDelete(record)}>
          Delete
        </Menu.Item>
        <Menu.Item key="publish" onClick={() => handlePublishToggle(record)}>
          {record.isPublished ? "Unpublished" : "Publish"}
        </Menu.Item>
        {/* <Menu.Item key="detail" onClick={() => handleDetail(record)}>
          Detail
        </Menu.Item> */}
      </Menu>
    );
  };

  const handlePublishToggle = async (record) => {
    try {
      console.log(record.isPublished);
      const newStatus = !record.isPublished;
      console.log(newStatus);
      const response = await api.put(
        `online-serie-box/${record.boxOption.boxOptionId}/publish?status=${newStatus}`
      );
      console.log(response.data);
      toast.success(
        newStatus ? "Published successfully" : "Unpublished successfully"
      );

      fetchLuckyBox();
    } catch (error) {
      console.error("Failed to update publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const handleModalLuckyUpdate = (record) => {
    setSelectedLuckyBox(record);
    formUpdateLucky.setFieldsValue({
      ...record,
      originPrice: record.boxOption.originPrice,
      displayPrice: record.boxOption.displayPrice,
    });
    setIsModalUpdateLuckyOpen(true);
  };

  const handleAddLucky = async (values) => {
    const imgURLs = fileList.map((file) => file.url);
    values.imageUrl = imgURLs[0];

    values.createBoxOptionRequest = {
      boxId: values.BoxId,
      boxOptionName: values.boxOptionName,
      boxOptionStock: values.boxOptionStock,
      originPrice: values.originPrice,
      displayPrice: values.displayPrice,
      isOnlineSerieBox: true,
    };
    console.log(values);
    try {
      const response = await api.post("online-serie-box/create", values);
      console.log(response);
      fetchLuckyBox();
      toast.success("Box's Option added successfully");
      setIsModalAddLuckyOpen(false);
      formAddLucky.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Failed to add LuckyBox:", error);
      toast.error("Failed to add Lucky");
    }
  };

  const handleUpdateLucky = async (values) => {
    if (fileList && fileList.length > 0) {
      const imagURLUpdate = fileList.map((file) => file.url);
      values.imageUrl = imagURLUpdate[0];
    } else {
      values.imageUrl = selectedLuckyBox.imageUrl;
    }
    console.log(values);
    try {
      const response = await api.put(
        `online-serie-box/${selectedLuckyBox.onlineSerieBoxId}`,
        values
      );
      console.log(response);
      fetchLuckyBox();
      toast.success("Lucky Box modified successfully");
      setIsModalUpdateLuckyOpen(false);
      formUpdateLucky.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Failed to Update LuckyBox:", error);
      toast.error("Failed to Update Lucky Box");
    }
  };

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        destroyInactiveTabPane
      >
        <Tabs.TabPane tab="Manage Box Option" key="1">
          <div>
            <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
              Create Options for Box
            </Button>

            <Table dataSource={boxOption} columns={columnBoxOptions} />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Manage Online Lucky Box" key="2">
          <div>
            <Button
              className="mb-5"
              onClick={() => setIsModalAddLuckyOpen(true)}
            >
              Create Online Lucky Box
            </Button>
            <Table dataSource={luckyBox} columns={columnsLuckyBox} />
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="Add BoxOption"
        visible={isModalAddOpen}
        onCancel={() => setIsModalAddOpen(false)}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="boxOptionName"
            label="Box Option's Name"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Box Option's Stock"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select
              placeholder="Select Box"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {box.map((box) => (
                <Select.Option key={box.boxId} value={box.boxId}>
                  {box.boxName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update BoxOption"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="boxOptionName"
            label="Box Option's Name"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Box Option's Stock"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select
              placeholder="Select Box"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {box.map((box) => (
                <Select.Option key={box.boxId} value={box.boxId}>
                  {box.boxName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Online Lucky Box"
        visible={isModalAddLuckyOpen}
        onCancel={() => setIsModalAddLuckyOpen(false)}
        onOk={() => formAddLucky.submit()}
      >
        <Form
          form={formAddLucky}
          layout="vertical"
          onFinish={handleAddLucky}
          requiredMark={false}
        >
          <Form.Item
            name="priceAfterSecret"
            label="Price after Open Secret"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="priceIncreasePercent"
            label="Increase Price Percent per Turn"
            rules={[{ required: true, message: "Please enter the Percent" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="imageUrl" label="Image">
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
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select
              placeholder="Select Box"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {box.map((box) => (
                <Select.Option key={box.boxId} value={box.boxId}>
                  {box.boxName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="boxOptionName"
            label="Online Box's Name"
            rules={[
              {
                required: true,
                message: "Please enter the Online Lucky Box name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Stock"
            rules={[
              {
                required: true,
                message: "Please enter the stock",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              {
                required: true,
                message: "Please enter the Origin Price",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              {
                required: true,
                message: "Please enter the Display Price",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Online Lucky Box"
        visible={isModalUpdateLuckyOpen}
        onCancel={() => setIsModalUpdateLuckyOpen(false)}
        onOk={() => formUpdateLucky.submit()}
      >
        <Form
          form={formUpdateLucky}
          layout="vertical"
          onFinish={handleUpdateLucky}
        >
          <Form.Item
            name="priceIncreasePercent"
            label="Increase Price Percent per Turn"
            rules={[{ required: true, message: "Please enter the Percent" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="priceAfterSecret"
            label="Price after Open Secret"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="imageUrl" label="Image">
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
            name="originPrice"
            label="Origin Price"
            rules={[
              {
                required: true,
                message: "Please enter the Origin Price",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              {
                required: true,
                message: "Please enter the Display Price",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
