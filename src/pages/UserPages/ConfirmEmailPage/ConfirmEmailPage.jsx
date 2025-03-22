import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { confirmEmail } from "../../../services/UserServices/AuthServices/AuthServices";
import { route } from "../../../routes";

export default function ConfirmEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const handleConfirmEmail = async () => {
      try {
        const message = await confirmEmail(token, email);
        toast.success(message.message);
        console.log(message);
        navigate(route.login);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    if (token && email) {
      handleConfirmEmail();
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Processing your email confirmation...</h1>
    </div>
  );
}
