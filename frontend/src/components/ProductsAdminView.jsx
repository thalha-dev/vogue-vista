import { RxStarFilled } from "react-icons/rx";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  allShoesCB,
  allShoesStatusCB,
  errorMessageCB,
  errorMessageFromCB,
  getAllShoes,
} from "../../state/slice/shoeSlice";
import { getLoginStatusCB } from "../../state/slice/userSlice";
import { useEffect } from "react";
import { numberToInr } from "../utils/utils";

const ProductsAdminView = () => {
  const allshoes = useSelector(allShoesCB);
  const allShoesStatus = useSelector(allShoesStatusCB);
  const errorMessage = useSelector(errorMessageCB);
  const loginStatus = useSelector(getLoginStatusCB);
  const errorMessageFrom = useSelector(errorMessageFromCB);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus === "success" && allShoesStatus !== "success") {
      dispatch(getAllShoes());
    }
  }, [loginStatus, allShoesStatus]);

  const handleNotify = (message, cause) => {
    toast.error(message);
  };

  // function to render shoes from given wish list
  const renderShoes = (shoes, outOfStock) => {
    return shoes
      .filter((shoe) => {
        if (outOfStock) {
          if (shoe.shoesAvailable === 0) {
            return true;
          }
        } else {
          if (shoe.shoesAvailable > 0) {
            return true;
          }
        }
      })
      .map((shoe) => (
        <div key={shoe?._id} className="admin-product-container">
          <div className="admin-product-upper-container">
            <Link
              className="admin-product-link"
              to={`/singleProduct/${shoe._id}`}
            >
              <img
                className="admin-product-image"
                src={shoe?.shoeImages[0]?.imageUrl}
                alt={`product image of the shoe ${shoe?.shoeName}`}
              />
            </Link>
            <div className="admin-product-rating-wish-container">
              <span className="admin-product-rating">
                <RxStarFilled />
                {shoe.shoeRating}
              </span>
              <button className="admin-product-edit-button">
                <AiFillEdit className="admin-product-edit-button-pencil" />
              </button>
            </div>
          </div>
          <Link
            className="admin-product-link"
            to={`/singleProduct/${shoe._id}`}
          >
            <div className="admin-product-lower-container">
              <p className="admin-product-brand">{shoe.shoeBrand}</p>
              <p className="admin-product-name">{shoe.shoeName}</p>
              <div className="admin-product-size-color-container">
                <p className="admin-product-size">{shoe.shoeSize} UK</p>
                <p className="admin-product-color">{shoe.shoeColor}</p>
              </div>
              <p className="admin-product-price">
                {numberToInr(shoe.shoePrice)}
              </p>
            </div>
          </Link>
        </div>
      ));
  };

  return (
    <div className="admin-prducts-container">
      <h2>Products Out of Stock</h2>
      <section className=" admin-products-display-section">
        {allShoesStatus && renderShoes(allshoes, true)}
      </section>
      <h2>Products In Stock</h2>
      <section className=" admin-products-display-section">
        {allShoesStatus && renderShoes(allshoes, false)}
      </section>
      {allShoesStatus === "failed" &&
        errorMessageFrom === "getAllShoes" &&
        handleNotify(errorMessage, "getAllShoesFailed")}
    </div>
  );
};

export default ProductsAdminView;
