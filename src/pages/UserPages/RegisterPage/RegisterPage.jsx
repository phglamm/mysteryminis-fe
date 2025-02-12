import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BlurText from "../../../components/BlurText/BlurText";
import { Button, Form, Input, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import { route } from "../../../routes";

export default function RegisterPage() {
  const [form] = useForm();

  const handleRegister = () => {};
  return (
    <div className="flex items-center justify-center min-h-screen mt-24">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3 }}
        className=" p-8 rounded-2xl w-180"
      >
        <BlurText
          text="Sign Up"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl text-center mb-10 font-bold"
        />

        <Form
          form={form}
          name="login"
          onFinish={handleRegister}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={<span className="text-lg font-medium">Username</span>}
            name="username"
            rules={[
              { required: true, message: "Please type in your Username!" },
            ]}
          >
            <Input
              placeholder="Enter your Username"
              size="large"
              className="!p-5"
            />
          </Form.Item>
          <Form.Item
            label={<span className="text-lg font-medium">Fullname</span>}
            name="Fullname"
            rules={[
              { required: true, message: "Please type in your Fullname!" },
            ]}
          >
            <Input
              placeholder="Enter your Fullname"
              size="large"
              className="!p-5"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Gender</span>}
            name="gender"
            rules={[{ required: true, message: "Please select your gender!" }]}
          >
            <Radio.Group className="!flex !justify-start !items-center gap-20 !mt-5">
              <Radio value={true} className="text-xl">
                <span className="text-xl">Male</span>
              </Radio>
              <Radio value={false} className="!text-xl">
                <span className="text-xl">Female</span>
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Phone</span>}
            name="phone"
            rules={[
              { required: true, message: "Please type in your phone number!" },
            ]}
          >
            <Input
              placeholder="Enter your phone number"
              size="large"
              className="!p-5"
            />
          </Form.Item>
          <Form.Item
            label={<span className="text-lg font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please type in your email!" },
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

          <Form.Item
            label={<span className="text-lg font-medium">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please type in your password!" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[a-z]).{8,}$/,
                message:
                  "Password must be at least 8 characters long and include at least 1 uppercase and 1 lowercase letter!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              className="!p-5"
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label={
              <span className="text-lg font-medium">Confirm Password</span>
            }
            name="confirm_password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your password"
              size="large"
              className="!p-5"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full !bg-[#598099] !text-[#ffffff] !text-2xl !p-8 !font-bold"
              onClick={() => form.submit()}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="flex justify-center gap-1 items-center font-bold">
          Already have an Account ?
          <Link to={route.login} className="hover:underline text-[#598099]">
            <span>Login</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
