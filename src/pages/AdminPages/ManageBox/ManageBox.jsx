import { Button, Form, Table, Tabs, Modal, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import api from "../../../config/api";
import toast from "react-hot-toast";

export default function ManageBox() {
  const [activeTab, setActiveTab] = useState("1");
  const [formAdd] = useForm();
  const [formUpdate] = useForm();

  const [box, setBox] = useState([]);
  const [brand, setBrand] = useState([]);

  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  const handleAdd = async (values) => {
    try {
      const response = await api.post("Box", values);
      setBox([...box, response.data]);
      toast.success("Box added successfully");
      setIsModalAddOpen(false);
      formAdd.resetFields();
    } catch (error) {
      console.error("Failed to add Box:", error);
      toast.error("Failed to add Box");
    }
  };

  const handleModalUpdate = (box) => {
    setSelectedBox(box);
    formUpdate.setFieldsValue(box);
    setIsModalUpdateOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const response = await api.put(`Box/${selectedBox.boxId}`, values);
      console.log(response.data);
      setBox(
        box.map((box) =>
          box.boxId === selectedBox.boxId ? { ...box, ...values } : box
        )
      );
      toast.success("Updated Box successfully");
      setIsModalUpdateOpen(false);
      setSelectedBox(null);
    } catch (error) {
      console.error("Failed to update Box:", error);
      toast.error("Failed to update Box");
    }
  };

  const handleDelete = (values) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Box?",
      onOk: async () => {
        try {
          await api.delete(`Box/${values.boxId}`);
          toast.success("Box deleted successfully");
          setBox(box.filter((brand) => brand.boxId !== values.boxId));
        } catch (error) {
          toast.error("Failed to delete Box");
        }
      },
    });
  };

  useEffect(() => {
    const fetchBox = async () => {
      const response = await api.get("Box");
      console.log(response.data);
      const sortReponse = response.data.sort((a, b) => b.boxId - a.boxId);
      setBox(sortReponse);
    };

    const fetchBrand = async () => {
      const response = await api.get("Brand");
      console.log(response.data);
      setBrand(response.data);
    };

    fetchBox();
    fetchBrand();
  }, []);

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
          box.map((item) => ({
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
              <Button onClick={() => handleModalUpdate(record)}>Update</Button>
              <Button onClick={() => handleDelete(record)}>Delete</Button>
            </div>
            <Button>Create Online Blindbox</Button>
          </div>
        </>
      ),
    },
  ];

  const mockLuckyBoxData = [
    {
      OnlineSerieBoxId: 101,
      BoxId: 1,
      Price: 29.99,
      Name: "Lucky Draw A",
      IsSecretOpen: true,
      Turn: 3,
    },
    {
      OnlineSerieBoxId: 102,
      BoxId: 2,
      Price: 49.99,
      Name: "Lucky Draw B",
      IsSecretOpen: false,
      Turn: 5,
    },
    {
      OnlineSerieBoxId: 103,
      BoxId: 3,
      Price: 39.99,
      Name: "Lucky Draw C",
      IsSecretOpen: true,
      Turn: 2,
    },
  ];

  const columnsLuckyBox = [
    {
      title: "ID",
      dataIndex: "OnlineSerieBoxId",
      key: "OnlineSerieBoxId",
    },
    {
      title: "From Box ID",
      dataIndex: "BoxId",
      key: "BoxId",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "IsSecretOpen",
      dataIndex: "IsSecretOpen",
      key: "IsSecretOpen",
    },
    {
      title: "Turn",
      dataIndex: "Turn",
      key: "Turn",
    },
    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex justify-around items-center">
            <Button>Update</Button>
            <Button>Delete</Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        destroyInactiveTabPane
      >
        {/* Tab 1 */}
        <Tabs.TabPane tab="Manage Box" key="1">
          <div>
            <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
              Create Box
            </Button>
            <Table dataSource={box} columns={columnsBox} />
          </div>
        </Tabs.TabPane>

        {/* Tab 2 */}
        {/* <Tabs.TabPane tab="Manage Online Lucky Box" key="2">
          <div>
            <Table dataSource={mockLuckyBoxData} columns={columnsLuckyBox} />
          </div>
        </Tabs.TabPane> */}

        {/* Tab 3 */}
      </Tabs>

      <Modal
        title="Add Box"
        visible={isModalAddOpen}
        onCancel={() => {
          setIsModalAddOpen(false);
          formAdd.resetFields();
        }}
        onOk={() => formAdd.submit()}
      >
        <Form form={formAdd} layout="vertical" onFinish={handleAdd}>
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
            <Select placeholder="Select Brand">
              {brand.map((brand) => (
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
      >
        <Form form={formUpdate} layout="vertical" onFinish={handleUpdate}>
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
            <Select placeholder="Select Brand">
              {brand.map((brand) => (
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
