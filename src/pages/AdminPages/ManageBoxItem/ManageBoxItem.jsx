import { Button, Image, Table } from "antd";

export default function ManageBoxItem() {
  const columnBoxItems = [
    {
      title: "ID",
      dataIndex: "BoxItemId",
      key: "BoxImageId",
    },
    {
      title: "Box Item's Image",
      dataIndex: "ImageUrl",
      key: "ImageUrl",
      render: (value) => (
        <Image src={value} style={{ width: "200px", height: "130px" }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "BoxItemName",
      key: "BoxItemName",
    },
    {
      title: "For Box Id",
      dataIndex: "BoxId",
      key: "BoxId",
    },
    {
      title: "For Box Name",
      dataIndex: "BoxName",
      key: "BoxName",
      filters: [
        ...new Set(
          mockBoxItems.map((item) => ({
            text: item.BoxName,
            value: item.BoxName,
          }))
        ),
      ], // 👈 Auto-generate filters
      onFilter: (value, record) => record.BoxName === value,
      filterSearch: true,
    },
    {
      title: "Type",
      dataIndex: "IsSecret",
      key: "IsSecret",
      render: (value) => (value ? "Secret" : "Normal"),
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
      <Button className="mb-5">Create Items for Box</Button>

      <Table
        dataSource={mockBoxItems}
        columns={columnBoxItems}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
