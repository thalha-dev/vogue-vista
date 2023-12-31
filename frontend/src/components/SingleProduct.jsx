import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  errorMessageCB,
  errorMessageFromCB,
  addToCart,
  getSingleShoe,
  singleShoeCB,
  addToCartStatusCB,
  clearAddToCartStatus,
  clearImagesInSingleProductPage,
} from "../../state/slice/shoeSlice";
import { HiStar } from "react-icons/hi";
import { Link } from "react-router-dom";
import { numberToInr } from "../utils/utils";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [imageInDisplay, setImageInDisplay] = useState("");
  const singleShoe = useSelector(singleShoeCB);
  const addToCartStatus = useSelector(addToCartStatusCB);
  const errorMessage = useSelector(errorMessageCB);
  const errorMessageFrom = useSelector(errorMessageFromCB);

  useEffect(() => {
    dispatch(getSingleShoe({ shoeId: id }));
    return () => {
      dispatch(clearImagesInSingleProductPage());
    };
  }, []);

  useEffect(() => {
    singleShoe?.shoeImages?.length > 0 &&
      setImageInDisplay(singleShoe.shoeImages[0].imageUrl);
  }, [singleShoe]);

  const handleImageInListHover = (imageUrl) => {
    setImageInDisplay(imageUrl);
  };

  const handleAddToCartButton = (productId) => {
    dispatch(addToCart({ productId: productId }));
  };

  const handleNotify = (message, cause) => {
    if (cause === "addToCartSuccess") {
      toast.success(message);
      setTimeout(() => {
        dispatch(clearAddToCartStatus());
      }, 500);
    }

    if (cause === "addToCartFalied") {
      toast.error(message);
      setTimeout(() => {
        dispatch(clearAddToCartStatus());
      }, 500);
    }
  };

  const stars = (rating) => {
    let uniqueKey = 1;
    rating = Math.round(rating);
    return Array.from({ length: rating }, () => {
      return <HiStar key={uniqueKey++} />;
    });
  };

  return (
    <div>
      <div className="single-shoe-container">
        <section className="single-shoe-image-section">
          <div className="single-shoe-image-container">
            <div className="single-shoe-images-in-display-container">
              <img
                src={imageInDisplay}
                alt="Image of the selected shoe in display"
              />
            </div>
            <div className="single-shoe-images-list">
              {singleShoe?.shoeImages &&
                singleShoe?.shoeImages.map((imgOb) => (
                  <div
                    key={imgOb?.imageId}
                    onMouseEnter={() => {
                      handleImageInListHover(imgOb?.imageUrl);
                    }}
                    onFocus={() => {
                      handleImageInListHover(imgOb?.imageUrl);
                    }}
                    tabIndex="0"
                  >
                    <img
                      className="single-shoe-image-in-list"
                      src={`${imgOb?.imageUrl}`}
                      alt="Another image of the selected shoe"
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>
        <section className="single-shoe-desc-section">
          <h2 className="single-shoe-desc-name">
            {singleShoe?.shoeName && singleShoe.shoeName}
          </h2>
          <div className="single-shoe-desc-brand-rating-container">
            <h4>{singleShoe?.shoeBrand && singleShoe.shoeBrand}</h4>
            <div className="single-shoe-desc-rating-container">
              <p>{singleShoe?.shoeRating && singleShoe.shoeRating}</p>
              {singleShoe?.shoeRating && stars(singleShoe.shoeRating)}
            </div>
          </div>
          <div className="single-shoe-desc-size-container">
            <p>SIZE</p>
            <p className="single-shoe-desc-size">
              {singleShoe?.shoeSize && singleShoe.shoeSize} UK
            </p>
          </div>
          <div className="single-shoe-desc-color-container">
            <p>COLOR</p>
            <p className="single-shoe-desc-color">
              {singleShoe?.shoeColor && singleShoe.shoeColor}
            </p>
          </div>
          <div className="single-shoe-desc-price">
            {singleShoe?.shoePrice && numberToInr(singleShoe.shoePrice)}
          </div>
          <button
            onClick={() => {
              handleAddToCartButton(singleShoe?._id && singleShoe._id);
            }}
            className="single-shoe-add-to-cart-button"
          >
            Add to Cart
          </button>
          <Link
            className="single-shoe-buy-now-link"
            to={`/currentOrderSummary/single`}
          >
            Buy Now
          </Link>
        </section>
      </div>
      {addToCartStatus === "failed" &&
        errorMessageFrom === "addToCart" &&
        handleNotify(errorMessage, "addToCartFalied")}
      {addToCartStatus === "success" &&
        handleNotify("Added to Cart", "addToCartSuccess")}
    </div>
  );
};

export default SingleProduct;
