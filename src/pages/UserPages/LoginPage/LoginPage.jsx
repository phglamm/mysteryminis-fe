import { motion } from "framer-motion";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import BlurText from "../../../components/BlurText/BlurText";
import "./LoginPage.scss";
export default function LoginPage() {
  const [form] = useForm();

  const handleLogin = () => {};

  const handleLoginGG = () => {};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3 }}
        className=" p-8 rounded-2xl w-180"
      >
        <BlurText
          text="Welcome to Mystery Minis "
          delay={150}
          animateBy="words"
          direction="top"
          className="text-5xl text-center mb-10 font-bold"
        />

        <Form form={form} name="login" onFinish={handleLogin} layout="vertical">
          <Form.Item
            label={<span className="text-lg font-medium">Email</span>}
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
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
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
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
              Login
            </Button>

            <div className="google-btn-container ">
              <button
                className="google-button flex items-center w-full border-2 border-black-500 justify-center gap-5 text-2xl font-bold mt-8 p-1 rounded-md cursor-pointer"
                onClick={handleLoginGG}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 262"
                  className="h-12"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                Đăng nhập bằng Google
              </button>
            </div>
          </Form.Item>
        </Form>
        <div className="flex flex-col justify-center items-center font-bold">
          <Link to="" className="hover:underline ">
            Quên mật khẩu
          </Link>
          <Link to="" className="hover:underline mt-2 ">
            BẠN CHƯA CÓ TÀI KHOẢN. ĐĂNG KÍ TẠI ĐÂY
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
