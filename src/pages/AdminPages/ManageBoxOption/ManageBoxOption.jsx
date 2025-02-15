import { Button, Image, Table } from "antd";
import React from "react";

export default function ManageBoxOption() {
  const mockBoxOptions = [
    {
      BoxOptionId: 1,
      BoxId: 101,
      BoxName: "Mystery Box A",
      OriginPrice: 20.99,
      DisplayPrice: 25.99,
      BoxOptionStock: 50,
    },
    {
      BoxOptionId: 2,
      BoxId: 102,
      BoxName: "Exclusive Box B",
      OriginPrice: 30.5,
      DisplayPrice: 35.99,
      BoxOptionStock: 30,
    },
    {
      BoxOptionId: 3,
      BoxId: 103,
      BoxName: "Secret Box C",
      OriginPrice: 15.0,
      DisplayPrice: 19.99,
      BoxOptionStock: 75,
    },
    {
      BoxOptionId: 4,
      BoxId: 104,
      BoxName: "Collector’s Box D",
      OriginPrice: 50.0,
      DisplayPrice: 55.99,
      BoxOptionStock: 20,
    },
    {
      BoxOptionId: 5,
      BoxId: 105,
      BoxName: "Surprise Box E",
      OriginPrice: 10.99,
      DisplayPrice: 14.99,
      BoxOptionStock: 100,
    },
  ];

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
