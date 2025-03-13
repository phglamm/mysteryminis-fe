import { Button, Form, Image, Input, Modal, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";
import uploadFile from "../../../utils/UploadImage";
import { PlusOutlined } from "@ant-design/icons";

export default function ManageBrand() {
  const [brand, setBrand] = useState([]);
  const [formAdd] = useForm();
  const [formUpdate] = useForm();

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleAdd = async (values) => {
    const imageUrl = fileList.map((file) => file.url);
    values.ImageUrl = imageUrl[0];
    try {
      const response = await api.post("Brand", values);
      setBrand([...brand, response.data]);
      toast.success("Brand added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Failed to add brand:", error);
      toast.error("Failed to add brand");
    }
  };

  const handleModalUpdate = (brand) => {
    setSelectedBrand(brand);
    formUpdate.setFieldsValue(brand);
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    if (fileList && fileList.length > 0) {
      const imagURLUpdate = fileList.map((file) => file.url);
      values.ImageUrl = imagURLUpdate[0];
    } else {
      values.ImageUrl = selectedBrand.ImageUrl;
    }
    try {
      const response = await api.put(`Brand/${selectedBrand._id}`, values);
      console.log(response.data);
      setBrand(
        brand.map((brand) =>
          brand._id === selectedBrand._id ? { ...brand, ...values } : brand
        )
      );
      toast.success("Updated successfully");
      setFileList([]);
      formUpdate.resetFields();
      setIsModalUpdateOpen(false);
      setSelectedBrand(null);
    } catch (error) {
      console.error("Failed to update brand:", error);
      toast.error("Failed to update brand");
    }
  };

  const handleDelete = (values) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Brand?",
      onOk: async () => {
        try {
          await api.delete(`Brand/${values._id}`);
          toast.success("Brand deleted successfully");
          setBrand(brand.filter((brand) => brand._id !== values._id));
        } catch (error) {
          toast.error("Failed to delete brand");
        }
      },
    });
  };

  useEffect(() => {
    const fetchBrand = async () => {
      const response = await api.get("Brand");
      console.log(response.data);
      const sortResponse = response.data.sort((a, b) => b._id - a._id);
      setBrand(sortResponse);
    };

    fetchBrand();
  }, []);

  const columnBrand = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "brandName",
      key: "brandName",
      filters: [
        ...new Set(
          brand.map((item) => ({
            text: item.brandName,
            value: item.brandName,
          }))
        ),
      ],
      onFilter: (value, record) => record.brandName === value,
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

  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
        Create Brand
      </Button>

      <Table dataSource={brand} columns={columnBrand} />

      <Modal
        title="Add Brand"
        visible={isModalAddOpen}
        onCancel={() => setIsModalAddOpen(false)}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="brandName"
            label="Brand's Name"
            rules={[{ required: true, message: "Please enter the brand name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="ImageUrl" label="Brand's Image">
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
        </Form>
      </Modal>

      <Modal
        title="Update Brand"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[{ required: true, message: "Please enter the brand name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="ImageUrl" label="Brand's Image">
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
        </Form>
      </Modal>
    </div>
  );
}
