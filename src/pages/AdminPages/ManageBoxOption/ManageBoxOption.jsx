/* eslint-disable no-unused-vars */
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
import Form from "antd/es/form/Form";
import toast from "react-hot-toast";
import uploadFile from "../../../utils/UploadImage";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import {
  addBoxOption,
  addLuckyBox,
  deleteBoxOption,
  fetchBoxOptions,
  fetchLuckyBoxes,
  publishLuckyBox,
  updateBoxOption,
  updateLuckyBox,
} from "../../../services/AdminServices/ManageBoxOptionServices/ManageBoxOptionServices";
import { getAllBoxes } from "../../../services/AdminServices/ManageBoxServices/ManageBoxServices";

export default function ManageBoxOption() {
  const [activeTab, setActiveTab] = useState("1");
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formAddLucky] = Form.useForm();
  const [formUpdateLucky] = Form.useForm();
  const [boxOption, setBoxOption] = useState([]);
  const [luckyBox, setLuckyBox] = useState([]);
  const [box, setBox] = useState([]);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxOption, setSelectedBoxOption] = useState(null);

  const fetchBoxOption = async () => {
    try {
      const data = await fetchBoxOptions();
      setBoxOption(data);
    } catch (error) {
      console.error("Error fetching Box Options:", error);
    }
  };

  const fetchLuckyBox = async () => {
    try {
      const data = await fetchLuckyBoxes();
      setLuckyBox(data);
    } catch (error) {
      console.error("Error fetching Lucky Boxes:", error);
    }
  };

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const data = await getAllBoxes();
        setBox(data);
      } catch (error) {
        console.error("Error fetching Boxes:", error);
      }
    };

    fetchLuckyBox();
    fetchBoxOption();
    fetchBox();
  }, []);

  const handleAdd = async (values) => {
    try {
      const data = await addBoxOption(values);
      setBoxOption([...boxOption, data]);
      toast.success("Box's Option added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
    } catch (error) {
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
      await updateBoxOption(selectedBoxOption.boxOptionId, values);
      fetchBoxOption();
      setIsModalUpdateOpen(false);
      setSelectedBoxOption(null);
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Failed to update BoxOption");
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box's Option?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteBoxOption(record.boxOptionId);
          fetchBoxOption();
          toast.success("Box's Option deleted successfully");
        } catch (error) {
          toast.error("Failed to delete BoxOption");
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
            <Button
              className="!bg-[#ff4d4f] !text-white"
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
            <Button
              className="!bg-[#313857] !text-white"
              onClick={() => handleModalUpdate(record)}
            >
              Update
            </Button>
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
      render: (value) => value.toLocaleString(),
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
      title: "Stocks",
      dataIndex: ["boxOption", "boxOptionStock"],
      key: ["boxOption", "boxOptionStock"],
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
      const newStatus = !record.isPublished;
      await publishLuckyBox(record.boxOption.boxOptionId, newStatus);
      fetchLuckyBox();
      toast.success(
        newStatus ? "Published successfully" : "Unpublished successfully"
      );
    } catch (error) {
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
    values.imageUrl = fileList.length ? fileList[0].url : null;
    if (!values.imageUrl) {
      toast.error("Please upload an image");
      return;
    }
    values.createBoxOptionRequest = {
      boxId: values.BoxId,
      boxOptionName: values.boxOptionName,
      boxOptionStock: values.boxOptionStock,
      originPrice: values.originPrice,
      displayPrice: values.displayPrice,
      isOnlineSerieBox: true,
    };

    try {
      await addLuckyBox(values);
      fetchLuckyBox();
      toast.success("Lucky Box added successfully");
      setIsModalAddLuckyOpen(false);
      formAddLucky.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error("Failed to add Lucky Box");
    }
  };

  const handleUpdateLucky = async (values) => {
    values.imageUrl = fileList.length
      ? fileList[0].url
      : selectedLuckyBox.imageUrl;

    try {
      await updateLuckyBox(selectedLuckyBox.onlineSerieBoxId, values);
      fetchLuckyBox();
      toast.success("Lucky Box modified successfully");
      setIsModalUpdateLuckyOpen(false);
      formUpdateLucky.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error("Failed to update Lucky Box");
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
            <Button
              className="mb-5 !bg-[#313857] !text-white"
              onClick={() => setIsModalAddOpen(true)}
            >
              Create Options for Box
            </Button>

            <Table dataSource={boxOption} columns={columnBoxOptions} />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="Manage Online Lucky Box" key="2">
          <div>
            <Button
              className="mb-5 !bg-[#313857] !text-white"
              onClick={() => setIsModalAddLuckyOpen(true)}
            >
              Create Online Lucky Box
            </Button>
            <Table dataSource={luckyBox} columns={columnsLuckyBox} />
          </div>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="Add Box Option"
        visible={isModalAddOpen}
        onCancel={() => setIsModalAddOpen(false)}
        onOk={() => formAdd.submit()}
      >
        <Form
          form={formAdd}
          layout="vertical"
          onFinish={handleAdd}
          requiredMark={false}
        >
          <Form.Item
            name="boxOptionName"
            label="Box Option's Name"
            rules={[
              { required: true, message: "Please enter the Box Option's name" },
              {
                max: 20,
                message: "Box Option name must be less than 20 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Box Option's Stock"
            rules={[
              {
                required: true,
                message: "Please enter the Box Option's stock",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[{ required: true, message: "Please enter the cost price" }]}
          >
            <Input type="number" min={1000} />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the display price" },
            ]}
          >
            <Input type="number" min={1000} />
          </Form.Item>

          <Form.Item
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please select the Box name" }]}
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
        title="Update Box Option"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
      >
        <Form
          form={formUpdate}
          layout="vertical"
          onFinish={handleUpdate}
          requiredMark={false}
        >
          <Form.Item
            name="boxOptionName"
            label="Box Option's Name"
            rules={[
              { required: true, message: "Please enter the Box Option's name" },
              {
                max: 20,
                message: "Box Option name must be less than 20 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Box Option's Stock"
            rules={[
              {
                required: true,
                message: "Please enter the Box Option's stock",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[{ required: true, message: "Please enter the cost price" }]}
          >
            <Input type="number" min={1000} />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the display price" },
            ]}
          >
            <Input type="number" min={1000} />
          </Form.Item>

          <Form.Item
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please select the Box name" }]}
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
        onCancel={() => {
          setIsModalAddLuckyOpen(false),
            formAddLucky.resetFields(),
            setFileList([]);
        }}
        onOk={() => formAddLucky.submit()}
        okText="Add"
        cancelText="Cancel"
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
            <Input type="number" min={1000} />
          </Form.Item>

          <Form.Item
            name="priceIncreasePercent"
            label="Increase Price Percent per Turn"
            rules={[{ required: true, message: "Please enter the Percent" }]}
          >
            <Input type="number" min={1} />
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
              {
                max: 30,
                message:
                  "Online Lucky Box name must be less than 30 characters",
              },
            ]}
          >
            <Input maxLength={30} />
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
            <Input type="number" min={1} />
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
            <Input type="number" min={1000} />
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
            <Input type="number" min={1000} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Online Lucky Box"
        visible={isModalUpdateLuckyOpen}
        onCancel={() => setIsModalUpdateLuckyOpen(false)}
        onOk={() => formUpdateLucky.submit()}
        okText="Update"
        cancelText="Cancel"
      >
        <Form
          form={formUpdateLucky}
          layout="vertical"
          onFinish={handleUpdateLucky}
          requiredMark={false}
        >
          <Form.Item
            name="priceAfterSecret"
            label="Price after Open Secret"
            rules={[{ required: true, message: "Please enter Price" }]}
          >
            <Input type="number" min={1000} />
          </Form.Item>

          <Form.Item
            name="priceIncreasePercent"
            label="Increase Price Percent per Turn"
            rules={[{ required: true, message: "Please enter the Percent" }]}
          >
            <Input type="number" min={1} />
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
            <Input type="number" min={1000} />
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
            <Input type="number" min={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
