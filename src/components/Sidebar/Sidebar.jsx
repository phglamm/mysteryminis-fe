import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout, Menu } from "antd";
const { Sider } = Layout;
import {
  AuditOutlined,
  BarChartOutlined,
  CommentOutlined,
  DropboxOutlined,
  HomeOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { RiFeedbackLine } from "react-icons/ri";
import { CiDiscount1 } from "react-icons/ci";
import { MdOutlineSmartToy } from "react-icons/md";

import { route } from "../../routes";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/Logo-removebg.png";
import "./Sidebar.scss";
export default function Sidebar() {
  function getItem(label, key, icon, children) {
    return {
      key,
      label,
      icon,
      children,
    };
  }
  const [items, setItems] = useState([]);
  const [key, setKey] = useState();
  const location = useLocation();
  const currentURI =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  const dataOpen = JSON.parse(localStorage.getItem("keys")) ?? [];

  const [openKeys, setOpenKeys] = useState(dataOpen);

  const role = "STAFF";
  useEffect(() => {
    if (role === "ADMIN") {
      setItems([
        getItem("Dashboard", route.dashboard, <BarChartOutlined />),
        getItem("Manager Account", route.accountManagement, <UserOutlined />),
        getItem("Manager Order", route.orderManagement, <AuditOutlined />),
        getItem("Manager Box", route.boxManagement, <DropboxOutlined />),
        getItem(
          "Manager Box Item",
          route.boxItemManagement,
          <MdOutlineSmartToy />
        ),
        getItem("Manager Discount", route.discountManagement, <CiDiscount1 />),
        getItem("Back to Home", "/", <HomeOutlined />),
        // getItem("Statistics", "/statistics", <BarChartOutlined />, [
        //   getItem("Club 1", "statistics"),
        //   getItem("Club 2", "stats-club-2"),
        //   getItem("Club 3", "stats-club-3"),
        //   getItem("All Clubs", "all-clubs"),
        // ]),
      ]);
    }

    if (role === "STAFF") {
      setItems([
        getItem("Manager Account", route.accountManagement, <UserOutlined />),
        getItem("Manager Order", route.orderManagement, <AuditOutlined />),
        getItem("Manager Box", route.boxManagement, <DropboxOutlined />),
        getItem(
          "Manager Box Item",
          route.boxItemManagement,
          <MdOutlineSmartToy />
        ),
        getItem(
          "Manager Feedback",
          route.feedbackManagement,
          <RiFeedbackLine />
        ),
        getItem("Manager Blog", route.blogManagement, <ReadOutlined />),
        getItem(
          "Chat with Customer",
          route.chatWithCustomer,
          <CommentOutlined />
        ),

        getItem("Back to Home", "/", <HomeOutlined />),
      ]);
    }
  }, []);

  const handleSubMenuOpen = (keyMenuItem) => {
    setOpenKeys(keyMenuItem);
  };
  const handleSelectKey = (keyPath) => {
    setKey(keyPath);
  };

  useEffect(() => {
    localStorage.setItem("keys", JSON.stringify(openKeys));
  }, [openKeys]);

  useEffect(() => {
    handleSubMenuOpen([...openKeys, key]);
  }, [currentURI]);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 60 }}
      className="h-screen !bg-[#313857] text-white font-bold"
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        className="!bg-[#313857] sidebar"
      >
        <div className="flex justify-center items-center mb-10">
          <img src={logo} alt="" className="w-50" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="h-full !bg-[#313857] !text-lg"
          selectedKeys={currentURI}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
        >
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((subItem) => (
                  <Menu.Item
                    key={subItem.key}
                    onClick={(e) => handleSelectKey(e.keyPath[1])}
                  >
                    <Link to={`/admin/${subItem.key}`}>{subItem.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link
                  to={
                    item.key === "/"
                      ? "/"
                      : role === "ADMIN"
                      ? `/admin/${item.key}`
                      : `/staff/${item.key}`
                  }
                >
                  {item.label}
                </Link>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
    </motion.div>
  );
}
