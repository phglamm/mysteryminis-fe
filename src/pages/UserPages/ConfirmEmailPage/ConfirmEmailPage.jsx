import React, { useEffect } from "react";
import { Button, Card, Typography } from "antd";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { route } from "../../../routes";
import api from "../../../config/api";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

export default function ConfirmEmailPage() {
  const { token } = useParams();
  useEffect(() => {
    const handleConfirm = async () => {
      try {
        const response = await api.get(
          `authentication/confirm-account/${token}`
        );

        console.log(response.data);
        toast.success(response.data.message);
      } catch (error) {
        toast.error("Failed to confirm email");
        console.error("Failed to confirm email:", error);
      }
    };
    handleConfirm();
  });
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: "spring", damping: 10 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ width: 400, textAlign: "center" }}>
        <Title level={2}>Email Confirmed</Title>
        <Text>
          Thank you for confirming your email. Please login to continue.
        </Text>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{ marginTop: 20 }}
        >
          <Button
            type="primary"
            onClick={() => navigate(route.login)}
            className="!bg-[#603891]"
          >
            Go to Login
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
