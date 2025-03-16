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
import { GiReceiveMoney } from "react-icons/gi";

import { route } from "../../routes";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/Logo-removebg.png";
import "./Sidebar.scss";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/features/counterSlice";
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

  const user = useSelector(selectUser);
  useEffect(() => {
    if (user.roleId === 1) {
      setItems([
        getItem("Dashboard", "", <BarChartOutlined />),
        getItem("Manage Account", route.accountManagement, <UserOutlined />),
        getItem("Manage Order", route.orderManagement, <AuditOutlined />),

        getItem("Manage Product", "", <DropboxOutlined />, [
          getItem("Manage Box", route.boxManagement, <DropboxOutlined />),
          getItem(
            "Manage Box Image",
            route.boxImageManagement,
            <BarChartOutlined />
          ),
          getItem(
            "Manage Box Item",
            route.boxItemManagement,
            <MdOutlineSmartToy />
          ),
          getItem(
            "Manage Box Options",
            route.boxOptionManagement,
            <DropboxOutlined />
          ),
        ]),
        getItem("Manage Brand", route.brandManagement, <DropboxOutlined />),
        getItem("Manage Discount", route.discountManagement, <CiDiscount1 />),
        getItem("Manage Voucher", route.voucherManagement, <GiReceiveMoney />),

        getItem("Back to Home", "/", <HomeOutlined />),
      ]);
    }

    if (user.roleId === 2) {
      setItems([
        getItem("Manager Account", route.accountManagement, <UserOutlined />),
        getItem("Manager Order", route.orderManagement, <AuditOutlined />),
        getItem("Manage Product", "", <DropboxOutlined />, [
          getItem("Manage Box", route.boxManagement, <DropboxOutlined />),
          getItem(
            "Manage Box Image",
            route.boxImageManagement,
            <BarChartOutlined />
          ),
          getItem(
            "Manage Box Item",
            route.boxItemManagement,
            <MdOutlineSmartToy />
          ),
          getItem(
            "Manage Box Options",
            route.boxOptionManagement,
            <DropboxOutlined />
          ),
        ]),
        getItem(
          "Manage Feedback",
          route.feedbackManagement,
          <RiFeedbackLine />
        ),
        getItem("Manager Blog", route.blogManagement, <ReadOutlined />),
        getItem(
          "Chat with Customer",
          route.chatWithCustomer,
          <CommentOutlined />
        ),
        getItem("Manage Voucher", route.voucherManagement, <GiReceiveMoney />),
        


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
      className="min-h-screen !bg-[#313857] text-white font-bold"
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
                    icon={subItem.icon}
                    onClick={(e) => handleSelectKey(e.keyPath[1])}
                  >
                    <Link
                      to={
                        user.roleId === 1
                          ? `/admin/${subItem.key}`
                          : `/staff/${subItem.key}`
                      }
                    >
                      {subItem.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link
                  to={
                    item.key === "/"
                      ? "/"
                      : user.roleId === 1
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
