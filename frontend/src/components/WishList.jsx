import { RxStarFilled } from "react-icons/rx";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  errorMessageCB,
  errorMessageFromCB,
  getAllShoesFromWishList,
  removeFromWishList,
  removeFromWishListStatusCB,
  wishListCB,
  wishListStatusCB,
} from "../../state/slice/shoeSlice";
import { getLoginStatusCB } from "../../state/slice/userSlice";
import { useEffect } from "react";

const WishList = () => {
  const wishListProducts = useSelector(wishListCB);
  const wishListProductsStatus = useSelector(wishListStatusCB);
  const removeFromWishListStatus = useSelector(removeFromWishListStatusCB);
  const errorMessage = useSelector(errorMessageCB);
  const loginStatus = useSelector(getLoginStatusCB);
  const wishListStatus = useSelector(wishListStatusCB);
  const errorMessageFrom = useSelector(errorMessageFromCB);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus === "success" && wishListStatus !== "success") {
      dispatch(getAllShoesFromWishList());
    }
  }, [loginStatus]);

  // function to handle remove from wishlist button click
  const handleRemoveButtonClick = (productId) => {
    dispatch(removeFromWishList({ productId: productId }));
  };

  const handleNotify = (message, cause) => {
    toast.error(message);
  };

  // function to render shoes from given wish list
  const renderShoesFromWishList = (shoes) => {
    return shoes.map((shoe) => (
      <div key={shoe?._id} className="wishlist-product-container">
        <div className="wishlist-product-upper-container">
          <Link
            className="wishlist-product-link"
            to={`/singleProduct/${shoe._id}`}
          >
            <img
              className="wishlist-product-image"
              src={shoe?.shoeImages[0]?.imageUrl}
              alt={`product image of the shoe ${shoe?.shoeName}`}
            />
          </Link>
          <div className="wishlist-product-rating-wish-container">
            <span className="wishlist-product-rating">
              <RxStarFilled />
              {shoe.shoeRating}
            </span>
            <button
              onClick={() => {
                handleRemoveButtonClick(shoe._id);
              }}
              className="wishlist-product-wishlist-button"
            >
              <MdDelete className="wishlist-product-wishlist-button-trash" />
            </button>
          </div>
        </div>
        <Link
          className="wishlist-product-link"
          to={`/singleProduct/${shoe._id}`}
        >
          <div className="wishlist-product-lower-container">
            <p className="wishlist-product-brand">{shoe.shoeBrand}</p>
            <p className="wishlist-product-name">{shoe.shoeName}</p>
            <div className="wishlist-product-size-color-container">
              <p className="wishlist-product-size">{shoe.shoeSize} UK</p>
              <p className="wishlist-product-color">{shoe.shoeColor}</p>
            </div>
            <p className="wishlist-product-price">
              <TbCurrencyRupee /> {shoe.shoePrice}
            </p>
          </div>
        </Link>
      </div>
    ));
  };

  return (
    <div className="wishlist-container">
      <section className="wishlist-products-display-section">
        {wishListProductsStatus && renderShoesFromWishList(wishListProducts)}
        {wishListProductsStatus === "failed" &&
          errorMessageFrom === "getAllShoesFromWishList" &&
          handleNotify(errorMessage, "getAllShoesFromWishListFailed")}
        {removeFromWishListStatus === "failed" &&
          errorMessageFrom === "removeFromWishList" &&
          handleNotify(errorMessage, "removeFromWishListFailed")}
      </section>
    </div>
  );
};

export default WishList;
