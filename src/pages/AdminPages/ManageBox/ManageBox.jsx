/* eslint-disable no-unused-vars */
import { Button, Form, Table, Tabs, Modal, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";
import {
  addBox,
  deleteBox,
  getAllBoxes,
  updateBox,
} from "../../../services/AdminServices/ManageBoxServices/ManageBoxServices";
import { fetchBrands } from "../../../services/AdminServices/ManageBrandServices/ManageBrandServices";

export default function ManageBox() {
  const [formAdd] = useForm();
  const [formUpdate] = useForm();

  const [boxes, setBoxes] = useState([]);
  const [brands, setBrands] = useState([]);

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  // Fetch all boxes and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBoxes = await getAllBoxes();
        const fetchedBrands = await fetchBrands();
        setBoxes(fetchedBoxes);
        setBrands(fetchedBrands);
      } catch (error) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // Handle adding new box
  const handleAdd = async (values) => {
    try {
      const newBox = await addBox(values);
      setBoxes([...boxes, newBox]);
      toast.success("Box added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
    } catch (error) {
      toast.error("Failed to add Box");
    }
  };

  // Handle updating a box
  const handleModalUpdate = (box) => {
    setSelectedBox(box);
    formUpdate.setFieldsValue(box);
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateBox(selectedBox.boxId, values);
      setBoxes(
        boxes.map((box) =>
          box.boxId === selectedBox.boxId ? { ...box, ...values } : box
        )
      );
      toast.success("Updated Box successfully");
      setIsModalUpdateOpen(false);
      setSelectedBox(null);
    } catch (error) {
      toast.error("Failed to update Box");
    }
  };

  // Handle deleting a box
  const handleDelete = (boxId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box?",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteBox(boxId);
          setBoxes(boxes.filter((box) => box.boxId !== boxId));
          toast.success("Box deleted successfully");
        } catch (error) {
          toast.error("Failed to delete Box");
        }
      },
    });
  };

  const columnsBox = [
    {
      title: "ID",
      dataIndex: "boxId",
      key: "boxId",
    },
    {
      title: "Name",
      dataIndex: "boxName",
      key: "boxName",
      filters: [
        ...new Set(
          boxes.map((item) => ({
            text: item.boxName,
            value: item.boxName,
          }))
        ),
      ], // 👈 Auto-generate filters
      onFilter: (value, record) => record.boxName === value,
      filterSearch: true,
    },

    {
      title: "Description",
      dataIndex: "boxDescription",
      key: "boxDescription",
    },

    {
      title: "Deleted",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (value) => (value ? "Deleted" : "Active"),
    },
    {
      title: "Sold",
      dataIndex: "soldQuantity",
      key: "soldQuantity",
    },
    {
      title: "Brand",
      dataIndex: "brandName",
      key: "brandName",
    },

    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex flex-col gap-3 items-center">
            <div className="flex justify-between items-center gap-7">
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
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        className="!bg-[#313857] !text-white mb-5"
        onClick={() => setIsModalAddOpen(true)}
      >
        Create Box
      </Button>
      <Table dataSource={boxes} columns={columnsBox} />

      <Modal
        title="Add Box"
        visible={isModalAddOpen}
        onCancel={() => {
          setIsModalAddOpen(false);
          formAdd.resetFields();
        }}
        onOk={() => formAdd.submit()}
        okText="Add"
        cancelText="Cancel"
      >
        <Form
          form={formAdd}
          layout="vertical"
          onFinish={handleAdd}
          requiredMark={false}
        >
          <Form.Item
            name="boxName"
            label="Box's Name"
            rules={[
              { required: true, message: "Please enter the Box name" },
              {
                max: 60,
                message: "Box name must be less than 60 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="boxDescription"
            label="Box's Description"
            rules={[
              { required: true, message: "Please enter the Box description" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please select Brand" }]}
          >
            <Select
              placeholder="Select Brand"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {brands.map((brand) => (
                <Select.Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Box"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
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
            name="boxName"
            label="Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="boxDescription"
            label="Box's Description"
            rules={[
              { required: true, message: "Please enter the Box description" },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="brandId"
            label="Brand"
            rules={[{ required: true, message: "Please select Brand" }]}
          >
            <Select
              placeholder="Select Brand"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {brands.map((brand) => (
                <Select.Option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
