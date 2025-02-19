/* eslint-disable no-unused-vars */
import { Button, Form, Image, Modal, Select, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import uploadFile from "./../../../utils/UploadImage";
import { PlusOutlined } from "@ant-design/icons";
import api from "./../../../config/api";

export default function ManageBoxImage() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();

  useEffect(() => {}, []);

  const columnBoxImage = [
    {
      title: "ID",
      dataIndex: "BoxImageId",
      key: "BoxImageId",
    },
    {
      title: "Image",
      dataIndex: "BoxImageUrl",
      key: "BoxImageUrl",
      render: (value) => (
        <Image src={value} style={{ width: "200px", height: "130px" }} />
      ),
    },
    {
      title: "For Box Id",
      dataIndex: "BoxId",
      key: "BoxId",
    },
    {
      title: "For Box Name",
      dataIndex: "BoxName",
      key: "BoxName",
      filters: [
        ...new Set(
          mockBoxImages.map((item) => ({
            text: item.BoxName,
            value: item.BoxName,
          }))
        ),
      ], // 👈 Auto-generate filters
      onFilter: (value, record) => record.BoxName === value,
      filterSearch: true,
    },

    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex justify-around items-center">
            <Button onClick={() => handleModalUpdate(record)}>Update</Button>
            <Button>Delete</Button>
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
    values.BoxImageUrl = imgURLs[0];
    console.log(values.BoxImageUrl);
    try {
      const response = await api.post(`Box`, values);
      console.log("Add response:", response);
      setIsModalAddOpen(false);
      formAdd.resetFields();
      setFileList([]);
    } catch (error) {
      formAdd.resetFields();
      setFileList([]);
      console.error("Failed to add Box:", error.response?.data || error);
    }
  };

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxImage, setSelectedBoxImage] = useState(null);

  const handleModalUpdate = (record) => {
    console.log(record);
    formUpdate.setFieldsValue(record);
    setIsModalUpdateOpen(true);
    setSelectedBoxImage(record);
  };

  const handleUpdate = async (values) => {
    console.log(selectedBoxImage);
    console.log(fileList);
    console.log(selectedBoxImage.BoxImageUrl);
    if (fileListUpdate && fileListUpdate.length > 0) {
      const imagURLUpdate = fileListUpdate.map((file) => file.url);
      values.BoxImageUrl = imagURLUpdate;
    } else {
      values.BoxImageUrl = selectedPerfume.BoxImageUrl;
    }
    console.log(values);
    try {
      const response = await api.put(
        `Perfume/${selectedPerfume.perfume_Id}`,
        values
      ); // Call API to update
      console.log(response.data);
      toast.success("Updated successfully");
      setPerfumes(
        perfumes.map((perfume) =>
          perfume.perfume_Id === selectedPerfume.perfume_Id
            ? { ...perfume, ...values }
            : perfume
        )
      );
      setisModalUpdateOpen(false); // Close modal
      setSelectedPerfume(null); // Reset selected brand
      setFileListUpdate([]);
    } catch (error) {
      console.error("Failed to update Perfume:", error.response?.data || error);
      toast.error("Failed to update Perfume");
    }
  };

  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
        Create Image for Box
      </Button>

      <Table
        dataSource={mockBoxImages}
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
          <Form.Item name="BoxImageUrl" label="Perfume Images">
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
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select placeholder="Select Box" allowClear>
              {mockBoxData.map((box) => (
                <Select.Option key={box.BoxId} value={box.BoxId}>
                  {box.BoxName}
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
          <Form.Item name="BoxImageUrl" label="Perfume Images">
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
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select placeholder="Select Box" allowClear>
              {mockBoxData.map((box) => (
                <Select.Option key={box.BoxId} value={box.BoxId}>
                  {box.BoxName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
