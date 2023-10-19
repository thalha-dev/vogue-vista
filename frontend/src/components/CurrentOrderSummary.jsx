import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  cartCB,
  cartTotalAmountCB,
  singleShoeCB,
} from "../../state/slice/shoeSlice";
import { Link } from "react-router-dom";
import { useState } from "react";
import { numberToInr } from "../utils/utils";

const CurrentOrderSummary = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const { orderType } = useParams();
  const cart = useSelector(cartCB);
  const total = useSelector(cartTotalAmountCB);
  const singleShoe = useSelector(singleShoeCB);

  return (
    <div className="order-summary-conatiner">
      <section className="order-summay-section">
        <h1>Order Summary</h1>
        <div className="order-summay-product-info">
          <div className="order-summay-product-name">NAME</div>
          <div className="order-summay-product-quantity">QUANTITY</div>
          <div className=" order-summay-product-price">PRICE</div>
        </div>
        {orderType === "single" ? (
          singleShoe?.shoeName ? (
            <div className="order-summay-product-info">
              <div className="order-summay-product-name">
                {singleShoe.shoeName}
              </div>
              <div className="order-summay-product-quantity">1</div>
              <div className="order-summay-product-price">
                {numberToInr(singleShoe.shoePrice)}
              </div>
            </div>
          ) : (
            ""
          )
        ) : cart?.cartItems ? (
          cart?.cartItems.map((item) => (
            <div className="order-summay-product-info">
              <div className="order-summay-product-name">
                {item.shoe.shoeName}
              </div>
              <div className="order-summay-product-quantity">
                {item.shoeCount}
              </div>
              <div className="order-summay-product-price">
                {numberToInr(item.shoe.shoePrice * item.shoeCount)}
              </div>
            </div>
          ))
        ) : (
          ""
        )}
        {orderType === "cart" && (
          <div className="order-summary-cart-total">
            <span>TOTAL</span> <span>{numberToInr(total)}</span>
          </div>
        )}
      </section>
      <section className="order-summary-delivery-address-section">
        <h3>Enter the Delivery Address </h3>
        <textarea
          onChange={(e) => {
            setDeliveryAddress(e.target.value.replace(/\//g, "0by0"));
          }}
          className="order-summary-delivery-address-textarea"
        ></textarea>
        {orderType === "single" ? (
          <Link
            className={`order-summary-proceed-to-pay-link ${
              deliveryAddress ? "" : "link-unclickable"
            }`}
            to={`/payment/${singleShoe._id}/single/${deliveryAddress}`}
          >
            Proceed to Pay
          </Link>
        ) : (
          <Link
            className={`order-summary-proceed-to-pay-link ${
              deliveryAddress ? "" : "link-unclickable"
            }`}
            to={`/payment/${cart._id}/cart/${deliveryAddress}`}
          >
            Proceed to Pay
          </Link>
        )}
      </section>
    </div>
  );
};

export default CurrentOrderSummary;
