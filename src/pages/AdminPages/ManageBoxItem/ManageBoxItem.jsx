import { Button, Form, Image, Input, Modal, Select, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../../utils/UploadImage";

export default function ManageBoxItem() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxItem, setBoxItem] = useState([]);
  const [box, setBox] = useState([]);

  const fetchBoxItem = async () => {
    const response = await api.get("BoxItem");
    console.log(response.data);
    const sortReponse = response.data.sort((a, b) => b.boxItemId - a.boxItemId);
    setBoxItem(sortReponse);
  };
  useEffect(() => {
    const fetchBox = async () => {
      const response = await api.get("Box");
      console.log(response.data);
      setBox(response.data);
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
            <Button onClick={() => handleModalUpdate(record)}>Update</Button>
            <Button onClick={() => handleDelete(record)}>Delete</Button>
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

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState("");
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
    console.log(values);
    const imgURLs = fileList.map((file) => file.url);
    values.imageUrl = imgURLs[0];
    console.log(values.imageUrl);
    try {
      const response = await api.post(`BoxItem`, values);
      console.log("Add response:", response.data);
      fetchBoxItem();
      setIsModalAddOpen(false);
      setFileList([]);
      formAdd.resetFields();
      toast.success("Add Box successfully");
    } catch (error) {
      setFileList([]);
      toast.error("Failed to add BoxItem");
      console.error("Failed to add BoxItem:", error.response?.data || error);
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
    console.log(selectedBoxItem);
    console.log(fileList);
    console.log(selectedBoxItem.imageUrl);
    if (fileList && fileList.length > 0) {
      const imagURLUpdate = fileList.map((file) => file.url);
      values.imageUrl = imagURLUpdate[0];
    } else {
      values.imageUrl = selectedBoxItem.imageUrl;
    }
    console.log(values);
    try {
      const response = await api.put(
        `BoxItem/${selectedBoxItem.boxItemId}`,
        values
      ); // Call API to update
      console.log(response.data);
      toast.success("Updated successfully");
      fetchBoxItem();
      setIsModalUpdateOpen(false); // Close modal
      setSelectedBoxItem(null); // Reset selected brand
      setFileList([]);
    } catch (error) {
      console.error(
        "Failed to update Box's Item:",
        error.response?.data || error
      );
      toast.error("Failed to update Box's Item");
    }
  };

  const handleDelete = (values) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box's Item?",
      onOk: async () => {
        try {
          await api.delete(`BoxItem/${values.boxItemId}`);
          toast.success("Box's Item deleted successfully");
          fetchBoxItem();
        } catch (error) {
          toast.error("Failed to delete Box's Item");
        }
      },
    });
  };
  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
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
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="boxItemName"
            label="Box's Item Name"
            rules={[
              { required: true, message: "Please enter the Box's Item name" },
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
              {fileList.length >= 2 ? null : uploadButton}
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
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="boxItemName"
            label="Box's Item Name"
            rules={[
              { required: true, message: "Please enter the Box's Item name" },
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
              {fileList.length >= 2 ? null : uploadButton}
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
