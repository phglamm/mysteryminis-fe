/* eslint-disable no-unused-vars */
import { Button, Form, Image, Modal, Select, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import uploadFile from "./../../../utils/UploadImage";
import { PlusOutlined } from "@ant-design/icons";
import api from "./../../../config/api";
import toast from "react-hot-toast";
import { addBoxImage, deleteBoxImage, getAllBoxImages, updateBoxImage } from "../../../services/AdminServices/ManageBoxImageServices.js/ManageBoxImageServices";
import { getAllBoxes } from "../../../services/AdminServices/ManageBoxServices/ManageBoxServices";

export default function ManageBoxImage() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxImage, setBoxImages] = useState([]);
  const [box, setBoxes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxImage, setSelectedBoxImage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBoxImages = await getAllBoxImages();
        const fetchedBoxes = await getAllBoxes();
        setBoxImages(fetchedBoxImages);
        setBoxes(fetchedBoxes);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const columnBoxImage = [
    {
      title: "ID",
      dataIndex: "boxImageId",
      key: "boxImageId",
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
      dataIndex: ["belongBox", "boxId"],
      key: "boxId",
    },
    {
      title: "For Box Name",
      dataIndex: ["belongBox", "boxName"],
      key: "boxName",
      filters: boxImage
        ? Array.from(
            new Set(boxImage.map((item) => item.belongBox?.boxName))
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

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const handleAdd = async (values) => {
    try {
      const imgURLs = fileList.map((file) => file.url);
      values.boxImageUrl = imgURLs[0];
      await addBoxImage(values);
      toast.success("Box image added successfully");
      setIsModalAddOpen(false);
      setFileList([]);
      formAdd.resetFields();
      setBoxImages(await getAllBoxImages());
    } catch (error) {
      toast.error("Failed to add box image");
    }
  };

  const handleModalUpdate = (record) => {
    console.log(record);
    formUpdate.setFieldsValue({
      ...record,
      BoxId: record.belongBox?.boxId, // Extract boxId from belongBox
    });
    setIsModalUpdateOpen(true);
    setSelectedBoxImage(record);
  };

  const handleUpdate = async (values) => {
    try {
      values.boxImageUrl = fileList.length > 0 ? fileList[0].url : selectedBoxImage.boxImageUrl;
      await updateBoxImage(selectedBoxImage.boxImageId, values);
      toast.success("Box image updated successfully");
      setIsModalUpdateOpen(false);
      setSelectedBoxImage(null);
      setFileList([]);
      setBoxImages(await getAllBoxImages());
    } catch (error) {
      toast.error("Failed to update box image");
    }
  };

  const handleDelete = (boxImage) => {
    Modal.confirm({
      title: "Are you sure you want to delete this box image?",
      onOk: async () => {
        try {
          await deleteBoxImage(boxImage.boxImageId);
          toast.success("Box image deleted successfully");
          setBoxImages(await getAllBoxImages());
        } catch (error) {
          toast.error("Failed to delete box image");
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
                <Select.Option
                  key={box.boxId}
                  value={box.boxId}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
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
