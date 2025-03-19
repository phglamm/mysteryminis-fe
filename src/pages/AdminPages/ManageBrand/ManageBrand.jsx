import { Button, Form, Input, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";
import { addBrand, deleteBrand, fetchBrands, updateBrand } from "../../../services/AdminServices/ManageBrandServices/ManageBrandServices";

export default function ManageBrand() {
  const [brand, setBrand] = useState([]);
  const [formAdd] = useForm();
  const [formUpdate] = useForm();

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

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
    try {
      const newBrand = await addBrand(values);
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
    try {
      await updateBrand(selectedBrand.brandId, values);
      setBrand(
        brand.map((b) =>
          b.brandId === selectedBrand.brandId ? { ...b, ...values } : b
        )
      );
      toast.success("Updated successfully");
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
          await deleteBrand(values.brandId);
          setBrand(brand.filter((b) => b.brandId !== values.brandId));
          toast.success("Brand deleted successfully");
        } catch (error) {
          console.error("Failed to delete brand:", error);
          toast.error("Failed to delete brand");
        }
      },
    });
  };


  const columnBrand = [
    {
      title: "ID",
      dataIndex: "brandId",
      key: "brandId",
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
        </Form>
      </Modal>
    </div>
  );
}
