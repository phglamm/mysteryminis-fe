import { motion } from "framer-motion";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { route } from "../../../routes";
import { resetPassword } from "../../../services/UserServices/AuthServices/AuthServices";

export default function ResetPasswordPage() {
  const [form] = useForm();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const token = decodeURIComponent(
    queryParams.get("token")?.replaceAll(" ", "+")
  );
  const email = queryParams.get("email");

  if (token && email) {
    console.log(email);
    console.log(token);
  }

  const handleSend = async (value) => {
    value.token = token;
    value.email = email;
    try {
      await resetPassword(value);
      toast.success("Password reset successfully");
      navigate(route.login);
    } catch (error) {
      console.error(error.response?.data || "An error occurred");
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
        <h4 className="text-5xl text-center mb-10 font-bold">
          Recovery Password
        </h4>
        <Form
          form={form}
          name="login"
          onFinish={handleSend}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<span className="text-lg font-medium">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
                message:
                  "Password must be at least 8 characters long and include at least 1 uppercase and 1 lowercase letter!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your new password"
              size="large"
              className="!p-5"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-lg font-medium">Confirm New Password</span>
            }
            name="confirm_password"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your new password"
              size="large"
              className="!p-5"
            />
          </Form.Item>

          <Form.Item className="!mt-3">
            <Button
              type="primary"
              className="w-full !bg-[#598099] !text-[#ffffff] !text-2xl !p-8 !font-bold"
              onClick={() => form.submit()}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </motion.div>
    </div>
  );
}
