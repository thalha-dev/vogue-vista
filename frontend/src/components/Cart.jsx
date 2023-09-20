import { useDispatch, useSelector } from "react-redux";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
  addToCart,
  addToCartStatusCB,
  cartCB,
  cartStatusCB,
  cartTotalAmountCB,
  clearAddToCartStatus,
  errorMessageCB,
  errorMessageFromCB,
  getAllShoesFromCart,
  removeFromCart,
  removeFromCartStatusCB,
} from "../../state/slice/shoeSlice";
import { getLoginStatusCB } from "../../state/slice/userSlice";
import { Link } from "react-router-dom";
import { numberToInr } from "../utils/utils";

const Cart = () => {
  const totalAmount = useSelector(cartTotalAmountCB);
  const cart = useSelector(cartCB);
  const cartStatus = useSelector(cartStatusCB);
  const loginStatus = useSelector(getLoginStatusCB);
  const errorMessage = useSelector(errorMessageCB);
  const errorMessageFrom = useSelector(errorMessageFromCB);
  const removeFromCartStatus = useSelector(removeFromCartStatusCB);
  const addToCartStatus = useSelector(addToCartStatusCB);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus === "success" && cartStatus !== "success") {
      dispatch(getAllShoesFromCart());
    }
  }, [loginStatus]);

  const handleRemoveProductFromCartButton = (productId) => {
    dispatch(
      removeFromCart({
        productId: productId,
        removeItemCompletely: true,
      }),
    );
  };

  const handleDecreaseProductQantityFromCartButton = (productId) => {
    dispatch(
      removeFromCart({
        productId: productId,
        removeItemCompletely: false,
      }),
    );
  };

  const handleIncreaseProductQantityFromCartButton = (productId) => {
    dispatch(addToCart({ productId: productId }));
  };

  const handleNotify = (message, cause) => {
    toast.error(message);
    if (cause === "addToCartFailed") {
      setTimeout(() => {
        dispatch(clearAddToCartStatus());
      }, 500);
    }
  };

  // function to render shoes from given wish list
  const renderFromCart = (cart) => {
    return cart.cartItems.map((ob) => (
      <div key={ob.shoe._id} className="cart-product-info-container">
        <div className="cart-product-image-quantity-container">
          <div className="cart-product-image-container">
            <img
              src={ob.shoe.shoeImages[0].imageUrl}
              alt="image of the product in cart"
            />
          </div>
          <div className="cart-product-quantity-container">
            <button
              tabIndex="0"
              className="cart-product-quantity-increase-button"
              onClick={() => {
                handleIncreaseProductQantityFromCartButton(ob.shoe._id);
              }}
            >
              <FaArrowUp />
            </button>
            <div className="cart-product-current-quantity">{ob.shoeCount}</div>
            <button
              tabIndex="0"
              onClick={() => {
                handleDecreaseProductQantityFromCartButton(ob.shoe._id);
              }}
              className="cart-product-quantity-decrease-button"
            >
              <FaArrowDown />
            </button>
          </div>
        </div>
        <div className="cart-product-description-container">
          <p className="cart-product-name">{ob.shoe.shoeName}</p>
          <p className="cart-product-brand">{ob.shoe.shoeBrand}</p>
          <div className="cart-product-size-container">
            <p>SIZE</p>
            <p className="cart-product-size">{ob.shoe.shoeSize} UK</p>
          </div>
          <div className="cart-product-color-container">
            <p>COLOR</p>
            <p className="cart-product-color">{ob.shoe.shoeColor}</p>
          </div>
          <p className="cart-product-price">
            {numberToInr(ob.shoe.shoePrice)}
            <button
              onClick={() => {
                handleRemoveProductFromCartButton(ob.shoe._id);
              }}
              className="cart-product-remove-button"
            >
              <MdDelete />
            </button>
          </p>
        </div>
      </div>
    ));
  };

  return (
    cartStatus === "success" &&
    totalAmount > 0 && (
      <div className="cart-container">
        <section className="cart-buy-section">
          <div className="cart-buy-sticky-conatiner">
            <div className="cart-total-amount-container">
              <p>
                Subtotal{" "}
                {cartStatus === "success" && cart.cartItems.length > 1
                  ? `(${cart.cartItems.length} shoes):`
                  : `(${cart.cartItems.length} shoe):`}
              </p>
              <h2 className="cart-total-amount">{numberToInr(totalAmount)}</h2>
            </div>
            <Link to={`/currentOrderSummary/cart`} className="cart-buy-link">
              Proceed to Buy
            </Link>
          </div>
        </section>
        <section className="cart-products-section">
          {cartStatus === "success" && renderFromCart(cart)}
          {removeFromCartStatus === "failed" &&
            errorMessageFrom === "removeFromCart" &&
            handleNotify(errorMessage, "removeFromCartFailed")}
          {addToCartStatus === "failed" &&
            errorMessageFrom === "addToCart" &&
            handleNotify(errorMessage, "addToCartFailed")}
        </section>
      </div>
    )
  );
};

export default Cart;
