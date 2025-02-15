import { Button, Image, Table } from "antd";

export default function ManageBoxItem() {
  const mockBoxItems = [
    {
      BoxItemId: 1,
      ImageUrl: "https://via.placeholder.com/200x130", // Placeholder image
      BoxItemName: "Mystery Figure A",
      BoxId: 101,
      BoxName: "Exclusive Box A",
      IsSecret: true,
    },
    {
      BoxItemId: 2,
      ImageUrl: "https://via.placeholder.com/200x130",
      BoxItemName: "Collectible Card B",
      BoxId: 102,
      BoxName: "Limited Edition Box B",
      IsSecret: false,
    },
    {
      BoxItemId: 3,
      ImageUrl: "https://via.placeholder.com/200x130",
      BoxItemName: "Special Sticker C",
      BoxId: 103,
      BoxName: "Surprise Box C",
      IsSecret: false,
    },
    {
      BoxItemId: 4,
      ImageUrl: "https://via.placeholder.com/200x130",
      BoxItemName: "Rare Keychain D",
      BoxId: 104,
      BoxName: "Lucky Box D",
      IsSecret: true,
    },
    {
      BoxItemId: 5,
      ImageUrl: "https://via.placeholder.com/200x130",
      BoxItemName: "Golden Token E",
      BoxId: 105,
      BoxName: "Ultimate Box E",
      IsSecret: true,
    },
  ];

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
