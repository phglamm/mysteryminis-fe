import { Button, Form, Image, Input, Modal, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";
import {
  addBrand,
  deleteBrand,
  fetchBrands,
  updateBrand,
} from "../../../services/AdminServices/ManageBrandServices/ManageBrandServices";
import uploadFile from "../../../utils/UploadImage";
import { PlusOutlined } from "@ant-design/icons";

export default function ManageBrand() {
  const [brand, setBrand] = useState([]);
  const [formAdd] = useForm();
  const [formUpdate] = useForm();

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    const getBrands = async () => {
      try {
        const brands = await fetchBrands();
        setBrand(brands);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
        toast.error("Failed to load brands");
      }
    };
    getBrands();
  }, []);

  const handleAdd = async (values) => {
    const imgURLs = fileList.map((file) => file.url);
    values.imageUrl = imgURLs[0];
    if (values.imageUrl === undefined) {
      toast.error("Please upload image");
      return;
    }
    console.log(values);
    try {
      const newBrand = await addBrand(values);
      fetchBrands();
      setBrand([...brand, newBrand]);
      toast.success("Brand added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
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
    console.log(fileList);
    values.imageUrl =
      fileList.length > 0 ? fileList[0].url : selectedBrand.imageUrl;
    console.log(values);
    try {
      await updateBrand(selectedBrand.brandId, values);
      setBrand(
        brand.map((b) =>
          b.brandId === selectedBrand.brandId ? { ...b, ...values } : b
        )
      );
      toast.success("Updated successfully");
      fetchBrands();
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
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteBrand(values.brandId);
          setBrand(brand.filter((b) => b.brandId !== values.brandId));
          toast.success("Brand deleted successfully");
        } catch (error) {
          console.error("Failed to delete brand:", error);
          toast.error(error.response.message);
        }
      },
    });
  };

  const columnBrand = [
    {
      title: "ID",
      dataIndex: "brandId",
      key: "brandId",
      sorter: (a, b) => a.brandId - b.brandId,
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (value) => (
        <Image src={value} style={{ width: "200px", height: "130px" }} />
      ),
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
            <Button
              className="!bg-[#ff4d4f] !text-white"
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
  return (
    <div>
      <Button
        className="mb-5 !bg-[#313857] !text-white"
        onClick={() => setIsModalAddOpen(true)}
      >
        Create Brand
      </Button>

      <Table dataSource={brand} columns={columnBrand} />

      <Modal
        okText="Add"
        cancelText="Cancel"
        title="Add Brand"
        visible={isModalAddOpen}
        onCancel={() => {
          setIsModalAddOpen(false);
          setFileList([]);
          formAdd.resetFields();
        }}
        onOk={() => formAdd.submit()}
      >
        <Form
          form={formAdd}
          layout="vertical"
          onFinish={handleAdd}
          requiredMark={false}
        >
          <Form.Item
            name="brandName"
            label="Brand's Name"
            rules={[{ required: true, message: "Please enter the brand name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="imageUrl" label="Brand's Images">
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
        okText="Update"
        cancelText="Cancel"
        title="Update Brand"
        visible={isModalUpdateOpen}
        onCancel={() => {
          setIsModalUpdateOpen(false);
          setFileList([]);
          formUpdate.resetFields();
        }}
        onOk={() => {
          formUpdate.submit();
        }}
      >
        <Form
          form={formUpdate}
          layout="vertical"
          onFinish={handleUpdate}
          requiredMark={false}
        >
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[{ required: true, message: "Please enter the brand name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="imageUrl" label="Brand's Images">
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
