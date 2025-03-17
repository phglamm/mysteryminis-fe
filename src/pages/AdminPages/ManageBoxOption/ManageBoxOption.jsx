import { Button, Input, Modal, Select, Table, Form } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";

export default function ManageBoxOption() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxOption, setBoxOption] = useState([]);
  const [box, setBox] = useState([]);

  const fetchBoxOption = async () => {
    const response = await api.get("BoxOption");
    console.log(response.data);
    const sortResponse = response.data.sort((a, b) => b._id - a._id);
    setBoxOption(sortResponse);
  };

  const fetchBox = async () => {
    const response = await api.get("Box");
    console.log(response.data);
    setBox(response.data);
  };

  useEffect(() => {
    fetchBoxOption();
    fetchBox();
  }, []);

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxOption, setSelectedBoxOption] = useState(null);

  const handleAdd = async (values) => {
    try {
      const response = await api.post("BoxOption", values);
      console.log(response.data);
      toast.success("Box's Option added successfully");
      fetchBoxOption();
      setIsModalAddOpen(false);
      formAdd.resetFields();
    } catch (error) {
      console.error("Failed to add BoxOption:", error);
      toast.error("Failed to add BoxOption");
    }
  };

  const handleModalUpdate = (record) => {
    setSelectedBoxOption(record);
    formUpdate.setFieldsValue({
      ...record,
      boxId: record.box?._id, // Extract boxId from box
    });
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await api.put(
        `BoxOption/${selectedBoxOption._id}`,
        values
      );
      console.log(response.data);
      toast.success("Updated successfully");
      fetchBoxOption();
      setIsModalUpdateOpen(false);
      setSelectedBoxOption(null);
    } catch (error) {
      console.error("Failed to update Box's Option:", error);
      toast.error("Failed to update Box's Option");
    }
  };

  const handleDelete = (values) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box's Option?",
      onOk: async () => {
        try {
          await api.delete(`BoxOption/${values._id}`);
          toast.success("Box's Option deleted successfully");
          setBoxOption(
            boxOption.filter((BoxOption) => BoxOption._id !== values._id)
          );
          fetchBoxOption();
        } catch (error) {
          toast.error("Failed to delete Box's Option");
        }
      },
    });
  };

  const columnBoxOptions = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
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
      dataIndex: ["box", "_id"],
      key: "_id",
    },
    {
      title: "For Box Name",
      dataIndex: ["box", "boxName"],
      key: "boxName",
      filters: boxOption
        ? Array.from(new Set(boxOption.map((item) => item.box?.boxName))).map(
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
            <Button onClick={() => handleModalUpdate(record)}
                        style={{ backgroundColor: '#313857', color: 'white' }}
              >Update</Button>
            <Button onClick={() => handleDelete(record)}
                        style={{ backgroundColor: '#FF3333', color: 'white' }}
              >Delete</Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}
                  style={{ backgroundColor: '#313857', color: 'white' }}
        >
        Create Options for Box
      </Button>

      <Table dataSource={boxOption} columns={columnBoxOptions} />

      <Modal
        title="Add BoxOption"
        visible={isModalAddOpen}
        onCancel={() => setIsModalAddOpen(false)}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="boxOptionName"
            label="Box Option's Name"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Box Option's Stock"
            rules={[
              { required: true, message: "Please enter the BoxOption stock" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              { required: true, message: "Please enter the origin price" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the display price" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxId"
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
                <Select.Option key={box._id} value={box._id}>
                  {box.boxName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update BoxOption"
        visible={isModalUpdateOpen}
        onCancel={() => setIsModalUpdateOpen(false)}
        onOk={() => formUpdate.submit()}
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="boxOptionName"
            label="Box Option's Name"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxOptionStock"
            label="Box Option's Stock"
            rules={[
              { required: true, message: "Please enter the BoxOption stock" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              { required: true, message: "Please enter the origin price" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the display price" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="boxId"
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
