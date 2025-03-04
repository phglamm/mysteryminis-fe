import React from "react";
import Sidebar from "./../../components/Sidebar/Sidebar";
import { Layout, theme } from "antd";
const { Content, Footer, Header } = Layout;

import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUser } from "../../Redux/features/counterSlice";

export default function AdminLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  const user = useSelector(selectUser);
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 60 }}
          className=" flex flex-col flex-grow bg-[#FFF1F2] "
        >
          <Header className="!bg-[#FFF1F2] !text-black flex items-center justify-end shadow-md gap-5">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt=""
              className="h-[50px] rounded-[100%] border border-black"
            />
            <div className="flex flex-col justify-start items-start">
              <p className="font-bold text-xl">{user.username}</p>
              <p className="text-sm">
                {user.role.roleName === "ADMIN" ? "Admin" : "Staff"}
              </p>
            </div>
          </Header>
          <Content
            className="p-6"
            style={{
              margin: "0 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="p-8"
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Outlet style={{ flexGrow: 1 }} />
            </div>
          </Content>
        </motion.div>
      </Layout>
    </Layout>
  );
}
