import { Button, Table, Tabs } from "antd";
import { useEffect, useState } from "react";

export default function ManageBox() {
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    const fetchBox = async () => {};
  }, []);

  const columnsBox = [
    {
      title: "ID",
      dataIndex: "BoxId",
      key: "BoxId",
    },
    {
      title: "Name",
      dataIndex: "BoxName",
      key: "BoxName",
      filters: [
        ...new Set(
          mockBoxData.map((item) => ({
            text: item.BoxName,
            value: item.BoxName,
          }))
        ),
      ], // 👈 Auto-generate filters
      onFilter: (value, record) => record.BoxName === value,
      filterSearch: true,
    },

    {
      title: "Description",
      dataIndex: "BoxDescription",
      key: "BoxDescription",
    },

    {
      title: "Deleted",
      dataIndex: "IsDeleted",
      key: "IsDeleted",
      render: (value) => (value ? "Deleted" : "Active"),
    },
    {
      title: "Sold",
      dataIndex: "SoldQuantity",
      key: "SoldQuantity",
    },
    {
      title: "Brand",
      dataIndex: "BrandName",
      key: "BrandName",
    },
    {
      title: "Action",
      render: (_index, record) => (
        <>
          <div className="flex flex-col gap-3 items-center">
            <div className="flex justify-between items-center gap-7">
              <Button>Update</Button>
              <Button>Delete</Button>
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
            <Button className="mb-5">Create Box</Button>
            <Table dataSource={mockBoxData} columns={columnsBox} />
          </div>
        </Tabs.TabPane>

        {/* Tab 2 */}
        <Tabs.TabPane tab="Manage Online Lucky Box" key="2">
          <div>
            <Table dataSource={mockLuckyBoxData} columns={columnsLuckyBox} />
          </div>
        </Tabs.TabPane>

        {/* Tab 3 */}
      </Tabs>
    </div>
  );
}
