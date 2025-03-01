import { useForm } from "antd/es/form/Form";
import { Button, Form, Input } from "antd";
import { motion } from "framer-motion";
import BlurText from "../../../components/React_Bits/BlurText/BlurText";
import toast from "react-hot-toast";
import api from "../../../config/api";

export default function ForgotPasswordPage() {
  const [form] = useForm();
  const handleSend = async (value) => {
    console.log(value);
    try {
      const response = await api.post("Account/forgot-password", value);
      console.log(response.data);
      toast.success(
        "Email sent successfully, check your email to reset password"
      );
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-[10%]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3 }}
        className=" p-8 rounded-2xl w-180"
      >
        <BlurText
          text="Reset Password"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl text-center mb-10 font-bold"
        />

        <Form
          form={form}
          name="login"
          onFinish={handleSend}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<span className="text-lg font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              placeholder="Enter your email"
              size="large"
              className="!p-5"
            />
          </Form.Item>

          <Form.Item className="!mt-3">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full !bg-[#598099] !text-[#ffffff] !text-2xl !p-8 !font-bold"
              onClick={() => form.submit()}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  );
}
