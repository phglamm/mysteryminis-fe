import { Button, Dropdown, Input, Menu, Modal, Select, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import Form from "antd/es/form/Form";
import toast from "react-hot-toast";
import { EllipsisOutlined } from "@ant-design/icons";

export default function ManageBoxOption() {
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [boxOption, setBoxOption] = useState([]);
  const [box, setBox] = useState([]);
  const [activeTab, setActiveTab] = useState("1"); // Active tab state
  const [mockLuckyBoxData, setMockLuckyBoxData] = useState([]);


  const fetchBoxOption = async () => {
    const response = await api.get("BoxOption");
    console.log(response.data);
    const sortReponse = response.data.sort(
      (a, b) => b.boxOptionId - a.boxOptionId
    );
    setBoxOption(sortReponse);
  };

  const fetchLuckyBoxData = async () => {
    try {
      const response = await api.get("online-serie-box");  // Đổi API thành online-serie-box
      const luckyBoxData = response.data.map((item) => ({
        BoxOptionId: item.boxOption.boxOptionId,
        CurrentPrice: item.boxOption.displayPrice,
        BasePrice: item.basePrice,
        IncreasePercent: item.priceIncreasePercent,
        PriceAfterSecret: item.priceAfterSecret,
        CurrentTurn: item.turn,
        MaxTurn: item.maxTurn,
        Quantity: item.boxOption.boxOptionStock || 0,
        isPublished: item.isPublished,  // Lấy isPublished
      }));
      setMockLuckyBoxData(luckyBoxData);
    } catch (error) {
      console.error("Failed to fetch lucky box data:", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchLuckyBoxData();
  }, []);
  

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
  
// Hàm xử lý publish
const handlePublish = async (record) => {
  try {
    // Gửi yêu cầu PUT với query parameter `status=true`
    const response = await api.put(
      `online-serie-box/${record.onlineSerieBoxId}/publish`,  // Đường dẫn mới
      null,  // Không cần gửi body
      { params: { status: true } }  // Gửi query parameter `status=true`
    );
    console.log(response.data);
    toast.success("Box Published successfully");
    fetchLuckyBoxData();  // Cập nhật lại dữ liệu
  } catch (error) {
    console.error("Failed to publish Box:", error);
    toast.error("Failed to publish Box");
  }
};

const handlePublishToggle = async (record) => {
  try {
    const newStatus = !record.isPublished;  // Đảo trạng thái publish (true -> false hoặc false -> true)
    const response = await api.put(
      `online-serie-box/${record.onlineSerieBoxId}/publish`,  // Đảm bảo đúng endpoint API
      null,  // Không cần gửi body
      { params: { status: newStatus } }  // Truyền status (true/false) qua query parameter
    );
    toast.success(newStatus ? "Published successfully" : "Unpublished successfully");

    // Cập nhật lại dữ liệu trong bảng
    setMockLuckyBoxData(
      mockLuckyBoxData.map((box) =>
        box.onlineSerieBoxId === record.onlineSerieBoxId
          ? { ...box, isPublished: newStatus }
          : box
      )
    );
  } catch (error) {
    console.error("Failed to update publish status:", error);
    toast.error("Failed to update publish status");
  }
};





  const getMenu = (record) => {
    return (
      <Menu>
        <Menu.Item key="update" onClick={() => handleModalUpdate(record)}>
          Update
        </Menu.Item>
        <Menu.Item key="delete" onClick={() => handleDelete(record)}>
          Delete
        </Menu.Item>
        <Menu.Item key="publish" onClick={() => handlePublishToggle(record)}>
          {record.isPublished ? "Unpublished" : "Publish"}
        </Menu.Item>
        {/* <Menu.Item key="detail" onClick={() => handleDetail(record)}>
          Detail
        </Menu.Item> */}

      </Menu>
    );
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


  const columnsLuckyBox = [
      {
        title: "Box Option ID",
        dataIndex: "BoxOptionId",
        key: "BoxOptionId",
      },
      {
        title: "Current Price",
        dataIndex: "CurrentPrice",
        key: "CurrentPrice",
        render: (value) => value ? value.toLocaleString() : "N/A",  // Safe check for undefined or null
      },
      {
        title: "Base Price",
        dataIndex: "BasePrice",
        key: "BasePrice",
        render: (value) => value.toLocaleString(),
      },
      {
        title: "Increase Percent",
        dataIndex: "IncreasePercent",
        key: "IncreasePercent",
        render: (value) => `${value}%`,
      },
      {
        title: "Price After Secret",
        dataIndex: "PriceAfterSecret",
        key: "PriceAfterSecret",
        render: (value) => value.toLocaleString(),
      },
      {
        title: "Current Turn",
        dataIndex: "CurrentTurn",
        key: "CurrentTurn",
      },
      {
        title: "Max Turn",
        dataIndex: "MaxTurn",
        key: "MaxTurn",
      },
      {
        title: "Quantity",
        dataIndex: "Quantity",
        key: "Quantity",
      },
      {
        title: "Is Secret Open",
        dataIndex: "isSecretOpen",
        key: "isSecretOpen",
        render: (value) => (value ? "true" : "false"), // Hiển thị Secret Opened nếu là true
      },
      {
        title: "Publish",
        dataIndex: "isPublished",
        key: "isPublished",
        render: (value) => (value ? "Published" : "Unpublished"), // Hiển thị "Published" hoặc "Unpublished"
      },
      
    {
      title: "Action",
      render: (_index, record) => (
        <Dropdown overlay={getMenu(record)} trigger={['click']}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
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
        <Tabs.TabPane tab="Manage Box Options" key="1">
          <div>
            <Button className="mb-5" onClick={() => setIsModalAddOpen(true)}>
              Create Options for Box
            </Button>

            <Table dataSource={boxOption} columns={columnBoxOptions} />
          </div>
        </Tabs.TabPane>

        {/* Tab 2 - Manage Online Lucky Box */}
        <Tabs.TabPane tab="Manage Online Lucky Box" key="2">
          <div>
          <Table dataSource={mockLuckyBoxData} columns={columnsLuckyBox} />
          </div>
        </Tabs.TabPane>
      </Tabs>

      {/* Modal for Add Box Option */}
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

      {/* Modal for Update Box Option */}
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
