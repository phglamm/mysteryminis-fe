import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../../config/api";
import toast from "react-hot-toast";
import { route } from "../../../routes";

const PaymentReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentData = async () => {
      const queryParams = new URLSearchParams(location.search);

      // Inform the user that the payment is being processed

      try {
        toast.loading("Processing payment, please wait...");
        const response = await api.post(
          "Payment/payment-callback",
          queryParams.toString(), // Send URL-encoded data
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            // Optionally include credentials if needed:
            withCredentials: false,
          }
        );

        // Check the response's success flag
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(route.orderSuccess);
        } else {
          toast.error("Payment failed. Please check your order and try again.");
          navigate("/order"); // Redirect back to the order page or keep them here
        }
      } catch (error) {
        toast.error("Error processing payment");
        console.error("Payment verification failed:", error);
        // Optionally, navigate back to the order page
        navigate("/order");
      }
    };

    fetchPaymentData();
  }, [location.search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Processing Payment...</h1>
    </div>
  );
};

export default PaymentReturnPage;
