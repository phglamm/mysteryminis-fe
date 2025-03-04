/* eslint-disable no-unused-vars */
import { Button, Form, Image, Modal, Select, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import uploadFile from "./../../../utils/UploadImage";
import { PlusOutlined } from "@ant-design/icons";
import api from "./../../../config/api";
import toast from "react-hot-toast";

export default function ManageBoxImage() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxImage, setBoxImage] = useState([]);
  const [box, setBox] = useState([]);

  const fetchBoxImage = async () => {
    const response = await api.get("BoxImage");
    console.log(response.data);
    const sortResponse = response.data.sort((a, b) => b._id - a._id);
    setBoxImage(sortResponse);
  };

  useEffect(() => {
    const fetchBox = async () => {
      const response = await api.get("Box");
      console.log(response.data);
      setBox(response.data);
    };

    fetchBoxImage();
    fetchBox();
  }, []);

  const columnBoxImage = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Image",
      dataIndex: "boxImageUrl",
      key: "boxImageUrl",
      render: (value) => (
        <Image src={value} style={{ width: "200px", height: "130px" }} />
      ),
    },
    {
      title: "For Box Id",
      dataIndex: ["box", "_id"],
      key: "_id",
    },
    {
      title: "For Box Name",
      dataIndex: ["box", "boxName"],
      key: "boxName",
      filters: boxImage
        ? Array.from(new Set(boxImage.map((item) => item.box?.boxName))).map(
            (name) => ({ text: name, value: name })
          )
        : [],
      onFilter: (value, record) => record.box?.boxName === value,
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

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const handleAdd = async (values) => {
    // Validate form inputs
    console.log(values);
    const imgURLs = fileList.map((file) => file.url);
    values.boxImageUrl = imgURLs[0];
    console.log(values.boxImageUrl);
    try {
      const response = await api.post(`BoxImage`, values);
      console.log("Add response:", response.data);
      fetchBoxImage();
      setIsModalAddOpen(false);
      setFileList([]);
      formAdd.resetFields();
      toast.success("Add Box successfully");
    } catch (error) {
      setFileList([]);
      toast.error("Failed to add BoxImage");
      console.error("Failed to add BoxImage:", error.response?.data || error);
    }
  };

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxImage, setSelectedBoxImage] = useState(null);

  const handleModalUpdate = (record) => {
    console.log(record);
    formUpdate.setFieldsValue({
      ...record,
      boxId: record.box?._id, // Extract boxId from box
    });
    setIsModalUpdateOpen(true);
    setSelectedBoxImage(record);
  };

  const handleUpdate = async (values) => {
    console.log(selectedBoxImage);
    console.log(fileList);
    console.log(selectedBoxImage.boxImageUrl);
    if (fileList && fileList.length > 0) {
      const imagURLUpdate = fileList.map((file) => file.url);
      values.boxImageUrl = imagURLUpdate[0];
    } else {
      values.boxImageUrl = selectedBoxImage.boxImageUrl;
    }
    console.log(values);
    try {
      const response = await api.put(
        `BoxImage/${selectedBoxImage._id}`,
        values
      ); // Call API to update
      console.log(response.data);
      toast.success("Updated successfully");
      fetchBoxImage();
      setIsModalUpdateOpen(false); // Close modal
      setSelectedBoxImage(null); // Reset selected brand
      setFileList([]);
    } catch (error) {
      console.error(
        "Failed to update Box's Image:",
        error.response?.data || error
      );
      toast.error("Failed to update Box's Image");
    }
  };

  const handleDelete = (values) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box's Image?",
      onOk: async () => {
        try {
          await api.delete(`BoxImage/${values._id}`);
          toast.success("Box's Image deleted successfully");
          fetchBoxImage();
        } catch (error) {
          toast.error("Failed to delete Box's Image");
        }
      },
    });
  };

  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
        Create Image for Box
      </Button>

      <Table
        dataSource={boxImage}
        columns={columnBoxImage}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Create Box Images"
        visible={isModalAddOpen}
        onCancel={() => {
          setIsModalAddOpen(false);
          formAdd.resetFields();
          setFileList([]);
        }}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="boxImageUrl" label="Box's Images">
            <Upload
              className="label-form-image"
              maxCount={1}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 2 ? null : uploadButton}
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
            name="boxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select placeholder="Select Box" allowClear>
              {box.map((box) => (
                <Select.Option key={box._id} value={box._id}>
                  {box.boxName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Box Image"
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
          <Form.Item name="boxImageUrl" label="Box's Images">
            <Upload
              className="label-form-image"
              maxCount={1}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 2 ? null : uploadButton}
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
            name="boxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select placeholder="Select Box" allowClear>
              {box.map((box) => (
                <Select.Option key={box._id} value={box._id}>
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
