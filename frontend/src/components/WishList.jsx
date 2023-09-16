import { RxStarFilled } from "react-icons/rx";
import { TbCurrencyRupee } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { wishListCB, wishListStatusCB } from "../../state/slice/shoeSlice";

const WishList = () => {
  const wishListProducts = useSelector(wishListCB);
  const wishListProductsStatus = useSelector(wishListStatusCB);

  // function to render shoes from given wish list
  const renderShoesFromWishList = (shoes) => {
    return shoes.map((shoe) => (
      <div key={shoe?._id} className="wishlist-product-container">
        <div className="wishlist-product-upper-container">
          <img
            className="wishlist-product-image"
            src={shoe?.shoeImages[0]?.imageUrl}
            alt={`product image of the shoe ${shoe?.shoeName}`}
          />
          <div className="wishlist-product-rating-wish-container">
            <span className="wishlist-product-rating">
              <RxStarFilled />
              {shoe.shoeRating}
            </span>
            <button className="wishlist-product-wishlist-button">
              <MdDelete className="wishlist-product-wishlist-button-trash" />
            </button>
          </div>
        </div>
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
      </div>
    ));
  };
  return (
    <div className="wishlist-container">
      <section className="wishlist-products-display-section">
        {wishListProductsStatus && renderShoesFromWishList(wishListProducts)}
      </section>
    </div>
  );
};

export default WishList;
