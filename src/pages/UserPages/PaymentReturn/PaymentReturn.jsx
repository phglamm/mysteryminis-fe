import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../../../config/api";
import toast from "react-hot-toast";
import { route } from "../../../routes";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../Redux/features/cartSlice";

const PaymentReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPaymentData = async () => {
      const queryParams = new URLSearchParams(location.search);

      // Inform the user that the payment is being processed
      console.log(queryParams.toString());
      try {
        const response = await api.post(
          "Payment/payment-callback",
          queryParams.toString(), // Send URL-encoded data
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            // Optionally include credentials if needed:
            withCredentials: false,
          }
        );
        console.log(response);
        // Check the response's success flag
        if (response.status === 200) {
          toast.success("Payment successful");
          if (response.data.boxOptionId !== undefined) {
            navigate(`${route.onlineBlindBox}/${response.data.boxOptionId}`, {
              state: { isPlay: true, reward: response.data },
            });
          } else {
            navigate(route.orderSuccess);
          }
          dispatch(clearCart());
        } else {
          toast.error("Payment failed. Please check your order and try again.");
          navigate(route.userProfile); // Redirect back to the order page or keep them here
        }
      } catch (error) {
        toast.error("Error processing payment");
        console.error("Payment verification failed:", error);
        // Optionally, navigate back to the order page
        navigate(route.userProfile);
      }
    };

    fetchPaymentData();
  }, [location.search, navigate ,dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Processing Payment...</h1>
    </div>
  );
};

export default PaymentReturnPage;
