import { motion } from "framer-motion";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.scss";
import { route } from "./../../../routes/index";
import BlurText from "../../../components/React_Bits/BlurText/BlurText";
import api from "./../../../config/api";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/features/counterSlice";
import toast from "react-hot-toast";
export default function LoginPage() {
  const [form] = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (value) => {
    console.log(value);
    try {
      const response = await api.post("Account/Login", value);
      console.log(response.data);
      Cookies.set("accessToken", response.data?.token, {
        expires: 7,
        secure: true,
      });
      const user = response.data.user;
      dispatch(login(user));
      if (user.roleId === 3) {
        navigate(route.home);
      } else if (user.roleId === 2) {
        navigate(`${route.staff}/${route.blogManagement}`);
      } else if (user.roleId === 1) {
        navigate(`${route.admin}/${route.boxManagement}`);
      }
      toast.success("Login Success");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  const handleLoginSuccess = async (response) => {
    const token = response.credential;
    console.log("google credentials: ", token);

    try {
      const response = await api.post("Account/google-login", {
        credentialToken: token,
      });
      console.log(response.data);
      Cookies.set("accessToken", response.data?.token, {
        expires: 7,
        secure: true,
      });
      dispatch(login());
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleLoginFailure = (error) => {
    console.log(error);
  };

  return (
    <GoogleOAuthProvider clientId="652662423552-nrkdvhr09m3qgau9jkmt887eg1u6k4u2.apps.googleusercontent.com">
      <div className="flex items-center justify-center min-h-screen mt-24">
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

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
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

            <Form.Item
              label={<span className="text-lg font-medium">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
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

            <div className="flex justify-end items-center">
              <Link
                className=" !hover:underline font-bold !text-[#598099]"
                to={""}
              >
                Forgot Password ?
              </Link>
            </div>
            <Form.Item className="!mt-3">
              <Button
                type="primary"
                className="w-full !bg-[#598099] !text-[#ffffff] !text-2xl !p-8 !font-bold"
                onClick={() => form.submit()}
              >
                Login
              </Button>

              <p className="text-center text-2xl font-bold mt-3 mb-3">or</p>

              <div className="google-btn-container ">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onFailure={handleLoginFailure}
                  buttonText="Login with Google"
                  className="google-button flex items-center w-full border-2 border-black-500 justify-center gap-5 text-xl font-bold p-2 rounded-md cursor-pointer"
                />
              </div>
            </Form.Item>
          </Form>
          <div className="flex justify-center gap-1 items-center font-bold">
            {"Don't"} have an account ?
            <Link
              to={route.register}
              className="hover:underline text-[#598099]"
            >
              <span>Sign up</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}
