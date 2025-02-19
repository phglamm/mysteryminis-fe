import { Button, Input, Modal, Select, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import Form from "antd/es/form/Form";
import toast from "react-hot-toast";

export default function ManageBoxOption() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxOption, setBoxOption] = useState([]);
  const [box, setBox] = useState([]);

  const fetchBoxOption = async () => {
    const response = await api.get("BoxOption");
    console.log(response.data);
    const sortReponse = response.data.sort(
      (a, b) => b.boxOptionId - a.boxOptionId
    );
    setBoxOption(sortReponse);
  };

  useEffect(() => {
    const fetchBox = async () => {
      const response = await api.get("Box");
      console.log(response.data);
      setBox(response.data);
    };

    fetchBoxOption();
    fetchBox();
  }, []);

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBoxOption, setSelectedBoxOption] = useState(null);

  const handleAdd = async (values) => {
    try {
      const response = await api.post("BoxOption", values);
      setBoxOption([...boxOption, response.data]);
      toast.success("Box's Option added successfully");
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
      BoxId: record.belongBox?.boxId, // Extract boxId from belongBox
    });
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await api.put(
        `BoxOption/${selectedBoxOption.boxOptionId}`,
        values
      );
      console.log(response.data);
      setBoxOption(
        boxOption.map((BoxOption) =>
          BoxOption.boxOptionId === selectedBoxOption.boxOptionId
            ? { ...BoxOption, ...values }
            : BoxOption
        )
      );
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
          await api.delete(`BoxOption/${values.boxOptionId}`);
          toast.success("Box's Option deleted successfully");
          setBoxOption(
            boxOption.filter(
              (BoxOption) => BoxOption.boxOptionId !== values.boxOptionId
            )
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
      dataIndex: "boxOptionId",
      key: "boxOptionId",
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
      dataIndex: ["belongBox", "boxId"],
      key: "boxId",
    },
    {
      title: "For Box Name",
      dataIndex: ["belongBox", "boxName"],
      key: "boxName",
      filters: boxOption
        ? Array.from(
            new Set(boxOption.map((item) => item.belongBox?.boxName))
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

  return (
    <div>
      <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
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
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select placeholder="Select Box" allowClear>
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
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="originPrice"
            label="Origin Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="displayPrice"
            label="Display Price"
            rules={[
              { required: true, message: "Please enter the BoxOption name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="BoxId"
            label="For Box's Name"
            rules={[{ required: true, message: "Please enter the Box name" }]}
          >
            <Select placeholder="Select Box" allowClear>
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
