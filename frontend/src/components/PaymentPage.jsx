import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../../state/axiosBase/api";
import {

    getAccessTokenCB,
  getIndividualIdCB,
  refreshAccessToken,
} from "../../state/slice/userSlice";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_API_KEY);
const PaymentPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { id, orderType, deliveryAddress } = useParams();
  const token = useSelector(getAccessTokenCB);
  const userId = useSelector(getIndividualIdCB);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const response = await api.post(
          "/api/shoes/stripePaymentIntent",
          {
            userId: userId,
            id: id,
            orderType: orderType,
            deliveryAddress: deliveryAddress,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            withCredentials: true,
          },
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            await dispatch(refreshAccessToken());

            const response = await api.post(
              "/api/shoes/stripePaymentIntent",
              {
                userId: userId,
                id: id,
                orderType: orderType,
                deliveryAddress: deliveryAddress,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },

                withCredentials: true,
              },
            );

            setClientSecret(response.data.clientSecret);
          } catch (refreshError) {
            toast.error("Error in user authentication");
          }
        } else {
          const errorMessage = error.response?.data?.error;
          if (errorMessage) {
            toast.error(errorMessage);
          }
          toast.error(error);
        }
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="pay">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;
