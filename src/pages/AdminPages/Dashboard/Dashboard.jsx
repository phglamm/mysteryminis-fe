import { useState } from "react";
import RevenueChart from "./../../../components/RevenueChart/RevenueChart";
import { Tabs } from "antd";
import BestSellerChart from "../../../components/BestSellerChart/BestSellerChart";

const { TabPane } = Tabs;

export default function Dashboard() {
  const [activeKey, setActiveKey] = useState("1");

  return (
    <div className="p-6 min-h-screen">
      <Tabs activeKey={activeKey} onChange={setActiveKey}>
        <TabPane tab="Revenue Chart" key="1">
          <RevenueChart />
        </TabPane>
        <TabPane tab="Best Seller Chart" key="2">
          <BestSellerChart />
        </TabPane>
      </Tabs>
    </div>
  );
}
