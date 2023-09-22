import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../state/axiosBase/api";

const PaymentSuccessPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");
  const refreshToken = params.get("refreshToken");

  useEffect(() => {
    const confirmOrder = async () => {
      try {
        await api.post(
          "/api/shoes/confirmOrder",
          {
            paymentIntentId: payment_intent,
          },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },

            withCredentials: true,
          },
        );
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (error) {
        console.log(error);
        toast.error("Confirmation Failed");
      }
    };
    confirmOrder();
  }, []);

  return (
    <div className="payment-success-page-container">
      <p>
        Payment successful. You are being redirected to the orders page. Please
        do not close the page.
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
