import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../config/api";
import toast from "react-hot-toast";

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const confirmEmail = async () => {
      try {
        const response = await api.get(`Account/confirm-email?token=${token}&email=${email}`);
        toast.success(response.data.message);
        navigate("/login");
      } catch (error) {
        toast.error(error.response.data.message);
        navigate("/login");
      }
    };

    if (token && email) {
      confirmEmail();
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Processing your email confirmation...</h1>
    </div>
  );
}