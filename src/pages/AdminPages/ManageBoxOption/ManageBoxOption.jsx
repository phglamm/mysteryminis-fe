import { Button, Image, Table } from "antd";
import React from "react";

export default function ManageBoxOption() {
  const columnBoxOptions = [
    {
      title: "ID",
      dataIndex: "BoxOptionId",
      key: "BoxOptionId",
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
      onFilter: (value, record) => record.BoxName === value,
      filterSearch: true,
    },
    {
      title: "Cost Price",
      dataIndex: "OriginPrice",
      key: "OriginPrice",
    },
    {
      title: "Display Price",
      dataIndex: "DisplayPrice",
      key: "DisplayPrice",
    },
    {
      title: "Stock",
      dataIndex: "BoxOptionStock",
      key: "BoxOptionStock",
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
      <Button className="mb-5">Create Options for Box</Button>

      <Table dataSource={mockBoxOptions} columns={columnBoxOptions} />
    </div>
  );
}
