import { Button, Form, Image, Input, Modal, Select, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/UploadImage";
import {
  addBoxItem,
  deleteBoxItem,
  fetchBoxItems,
  updateBoxItem,
} from "../../../services/AdminServices/ManageBoxItemServices/ManageBoxItemServices";
import { getAllBoxes } from "../../../services/AdminServices/ManageBoxServices/ManageBoxServices";

export default function ManageBoxItem() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxItem, setBoxItem] = useState([]);
  const [box, setBox] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState("");

  const fetchBoxItem = async () => {
    const data = await fetchBoxItems();
    setBoxItem(data);
  };

  useEffect(() => {
    const fetchBox = async () => {
      const data = await getAllBoxes();
      setBox(data);
    };
    fetchBoxItem();
    fetchBox();
  }, []);

  const columnBoxItems = [
    {
      title: "ID",
      dataIndex: "boxItemId",
      key: "boxItemId",
    },
    {
      title: "Box Item's Item",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (value) => (
        <Image src={value} style={{ width: "100px", height: "100px" }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "boxItemName",
      key: "boxItemName",
    },
    {
      title: "Average Rating",
      dataIndex: "averageRating",
      key: "averageRating",
    },
    {
      title: "Vote",
      dataIndex: "numOfVote",
      key: "numOfVote",
    },
    {
      title: "Type",
      dataIndex: "isSecret",
      key: "isSecret",
      render: (value) => (value ? "Secret" : "Normal"),
    },
    {
      title: "For Box Name",
      dataIndex: ["belongBox", "boxName"],
      key: "boxName",
      filters: boxItem
        ? Array.from(
            new Set(boxItem.map((item) => item.belongBox.boxName))
          ).map((name) => ({ text: name, value: name }))
        : [],
      onFilter: (value, record) => record.belongBox.boxName === value,
      filterSearch: true,
    },
    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex justify-around items-center">
            <Button
              className=" !bg-[#ff4d4f] !text-white"
              onClick={() => handleDelete(record)}
            >
              Delete
            </Button>
            <Button
              className=" !bg-[#313857] !text-white"
              onClick={() => handleModalUpdate(record)}
            >
              Update
            </Button>
          </div>
        </>
      ),
    },
  ];

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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewItem(file.url || file.preview);
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

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const handleAdd = async (values) => {
    try {
      values.imageUrl = fileList.map((file) => file.url)[0];
      await addBoxItem(values);
      fetchBoxItem();
      setIsModalAddOpen(false);
      setFileList([]);
      formAdd.resetFields();
      toast.success("Box item added successfully");
    } catch {
      toast.error("Failed to add BoxItem");
    }
  };

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxItem, setSelectedBoxItem] = useState(null);

  const handleModalUpdate = (record) => {
    console.log(record);
    formUpdate.setFieldsValue({
      ...record,
      BoxId: record.belongBox?.boxId, // Extract boxId from belongBox
    });
    setIsModalUpdateOpen(true);
    setSelectedBoxItem(record);
  };

  const handleUpdate = async (values) => {
    try {
      values.imageUrl = fileList.length
        ? fileList[0].url
        : selectedBoxItem.imageUrl;
      await updateBoxItem(selectedBoxItem.boxItemId, values);
      fetchBoxItem();
      setIsModalUpdateOpen(false);
      setFileList([]);
      toast.success("Box item updated successfully");
    } catch {
      toast.error("Failed to update BoxItem");
    }
  };

  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box's Item?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteBoxItem(record.boxItemId);
          fetchBoxItem();
          toast.success("Box item deleted successfully");
        } catch {
          toast.error("Failed to delete BoxItem");
        }
      },
    });
  };

  return (
    <div>
      <Button
        className="mb-5 !bg-[#313857] !text-white"
        onClick={() => setIsModalAddOpen(true)}
      >
        Create Items for Box
      </Button>

      <Table
        dataSource={boxItem}
        columns={columnBoxItems}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Create Box Items"
        visible={isModalAddOpen}
        onCancel={() => {
          setIsModalAddOpen(false);
          formAdd.resetFields();
          setFileList([]);
        }}
        onOk={() => formAdd.submit()}
        okText="Create"
        cancelText="Cancel"
      >
        <Form
          form={formAdd}
          layout="vertical"
          onFinish={handleAdd}
          requiredMark={false}
        >
          <Form.Item
            name="boxItemName"
            label="Box's Item Name"
            rules={[
              { required: true, message: "Please enter the Box's Item name" },
              {
                max: 60,
                message: "Box's Item name must be less than 60 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxItemDescription"
            label="Box's Item Description"
            rules={[
              {
                required: true,
                message: "Please enter the Box's Item Description",
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="boxItemEyes"
            label="Box's Item Eyes"
            rules={[
              {
                required: true,
                message: "Please enter the Box's Item Eyes",
              },
              {
                max: 20,
                message: "Box's Item Eyes must be less than 20 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxItemColor"
            label="Box's Item Color"
            rules={[
              {
                required: true,
                message: "Please enter the Box's Item Color",
              },
              {
                max: 20,
                message: "Box's Item Eyes must be less than 20 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="imageUrl" label="Box's Items">
            <Upload
              className="label-form-Item"
              maxCount={1}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewItem && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewItem(""),
                }}
                src={previewItem}
              />
            )}
          </Form.Item>

          <Form.Item
            name="isSecret"
            label="Type"
            rules={[
              {
                required: true,
                message: "Please Select the Box's Item Type",
              },
            ]}
          >
            <Select allowClear placeholder="Select type">
              <Select.Option value={false}>Normal</Select.Option>
              <Select.Option value={true}>Secret</Select.Option>
            </Select>
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
        title="Update Box Item"
        visible={isModalUpdateOpen}
        onCancel={() => {
          setIsModalUpdateOpen(false);
          formUpdate.resetFields();
          setFileList([]);
        }}
        onOk={() => {
          formUpdate.submit();
        }}
        okText="Update"
        cancelText="Cancel"
      >
        <Form
          form={formUpdate}
          layout="vertical"
          onFinish={handleUpdate}
          requiredMark={false}
        >
          <Form.Item
            name="boxItemName"
            label="Box's Item Name"
            rules={[
              { required: true, message: "Please enter the Box's Item name" },
              {
                max: 60,
                message: "Box's Item name must be less than 60 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxItemDescription"
            label="Box's Item Description"
            rules={[
              {
                required: true,
                message: "Please enter the Box's Item Description",
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="boxItemEyes"
            label="Box's Item Eyes"
            rules={[
              {
                required: true,
                message: "Please enter the Box's Item Eyes",
              },
              {
                max: 20,
                message: "Box's Item Eyes must be less than 20 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxItemColor"
            label="Box's Item Color"
            rules={[
              {
                required: true,
                message: "Please enter the Box's Item Color",
              },
              {
                max: 20,
                message: "Box's Item Eyes must be less than 20 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="imageUrl" label="Box's Items">
            <Upload
              className="label-form-Item"
              maxCount={1}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewItem && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewItem(""),
                }}
                src={previewItem}
              />
            )}
          </Form.Item>

          <Form.Item
            name="isSecret"
            label="Type"
            rules={[
              {
                required: true,
                message: "Please Select the Box's Item Type",
              },
            ]}
          >
            <Select allowClear placeholder="Select type">
              <Select.Option value={false}>Normal</Select.Option>
              <Select.Option value={true}>Secret</Select.Option>
            </Select>
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
    </div>
  );
}
