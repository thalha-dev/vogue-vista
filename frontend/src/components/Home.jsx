import { BiSearch } from "react-icons/bi";
import { BiFilterAlt } from "react-icons/bi";
import { RxStarFilled } from "react-icons/rx";
import { AiFillHeart } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishList,
  allShoesCB,
  getShoeBrandsCB,
  getShoeColorsCB,
  getshoeSizesCB,
} from "../../state/slice/shoeSlice";
import { Link } from "react-router-dom";
import { numberToInr } from "../utils/utils";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpand, setFilterExpand] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(["", ""]);

  const shoeBrands = useSelector(getShoeBrandsCB);
  const shoeSizes = useSelector(getshoeSizesCB);
  const shoeColors = useSelector(getShoeColorsCB);
  const allShoes = useSelector(allShoesCB);
  const [filteredProducts, setFilteredProducts] = useState(null);

  const dispatch = useDispatch();

  // generic function to handle checkbox changes
  const handleCheckboxChange = (event, selectedState, setSelectedState) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedState([...selectedState, value]);
    } else {
      setSelectedState(selectedState.filter((item) => item !== value));
    }
  };

  // For handling gender checkboxes
  const handleGenderCheckboxChange = (event) => {
    handleCheckboxChange(event, selectedGenders, setSelectedGenders);
  };

  // For handling size checkboxes
  const handleSizeCheckboxChange = (event) => {
    handleCheckboxChange(event, selectedSizes, setSelectedSizes);
  };

  // For handling brands checkboxes
  const handleBrandCheckboxChange = (event) => {
    handleCheckboxChange(event, selectedBrands, setSelectedBrands);
  };

  // For handling color checkboxes
  const handleColorCheckboxChange = (event) => {
    handleCheckboxChange(event, selectedColors, setSelectedColors);
  };

  // function to toggle filter section in mobile view
  const toggleFilter = () => {
    setFilterExpand(!filterExpand);
  };

  // function to apply all filters
  const handleApplyFilter = () => {
    const filtered = returnFilteredProducts(allShoes);
    setFilteredProducts(filtered);
  };

  // function to reset all filters
  const handleResetFilter = () => {
    setFilteredProducts(null);
    setSelectedGenders([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedPriceRange(["", ""]);
  };

  const handleSearchButtonClick = () => {
    const filteredBySearch = allShoes.filter((shoe) => {
      const query = searchQuery.trim().toLowerCase();
      if (
        shoe.shoeName.toLowerCase().includes(query) ||
        shoe.shoeBrand.toLowerCase().includes(query) ||
        shoe.shoeColor.toLowerCase().includes(query) ||
        shoe.shoeSize.toString() === query
      ) {
        return true;
      }
    });

    setFilteredProducts(filteredBySearch);
  };

  const handleAddToWishListButtonClick = (productId) => {
    dispatch(addToWishList({ productId: productId }));
  };

  // function to render shoes from given array of products
  const renderShoes = (shoes) => {
    return shoes.map((shoe) => (
      <div
        key={shoe?._id}
        className={`home-product-container ${
          shoe.shoesAvailable === 0 ? "display-none" : ""
        }`}
      >
        <div className="home-product-upper-container">
          <Link className="home-product-link" to={`/singleProduct/${shoe._id}`}>
            <img
              className="home-product-image"
              src={shoe?.shoeImages[0]?.imageUrl}
              alt={`product image of the shoe ${shoe?.shoeName}`}
            />
          </Link>
          <div className="home-product-rating-wish-container">
            <span className="home-product-rating">
              <RxStarFilled />
              {shoe.shoeRating}
            </span>
            <button
              onClick={() => {
                handleAddToWishListButtonClick(shoe._id);
              }}
              className="home-product-wishlist-button"
            >
              <AiFillHeart className="home-product-wishlist-button-heart" />
            </button>
          </div>
        </div>
        <Link className="home-product-link" to={`/singleProduct/${shoe._id}`}>
          <div className="home-product-lower-container">
            <p className="home-product-brand">{shoe.shoeBrand}</p>
            <p className="home-product-name">{shoe.shoeName}</p>
            <div className="home-product-size-color-container">
              <p className="home-product-size">{shoe.shoeSize} UK</p>
              <p className="home-product-color">{shoe.shoeColor}</p>
            </div>
            <p className="home-product-price">{numberToInr(shoe.shoePrice)}</p>
          </div>
        </Link>
      </div>
    ));
  };

  // function to filter the products with selected condition
  const returnFilteredProducts = (products) => {
    const productsToReturn = products.filter((shoe) => {
      let isGenderOk = false;
      let isSizeOk = false;
      let isBrandOk = false;
      let isColorOk = false;
      let isPriceOk = false;

      // checking for gender
      if (
        selectedGenders.length === 0 ||
        selectedGenders.includes(shoe.shoeGenderCategory)
      ) {
        isGenderOk = true;
      }

      // checking for brand
      if (
        selectedBrands.length === 0 ||
        selectedBrands.includes(shoe.shoeBrand)
      ) {
        isBrandOk = true;
      }

      // checking for color
      if (
        selectedColors.length === 0 ||
        selectedColors.includes(shoe.shoeColor)
      ) {
        isColorOk = true;
      }

      // checking for size
      if (
        selectedSizes.length === 0 ||
        selectedSizes.includes(shoe.shoeSize.toString())
      ) {
        isSizeOk = true;
      }

      // checking for price
      if (!selectedPriceRange[0] && !selectedPriceRange[1]) {
        isPriceOk = true;
      } else if (selectedPriceRange[0] && !selectedPriceRange[1]) {
        isPriceOk = Number(shoe.shoePrice) >= Number(selectedPriceRange[0]);
      } else if (!selectedPriceRange[0] && selectedPriceRange[1]) {
        isPriceOk = Number(shoe.shoePrice) <= Number(selectedPriceRange[1]);
      } else {
        isPriceOk =
          Number(shoe.shoePrice) >= Number(selectedPriceRange[0]) &&
          Number(shoe.shoePrice) <= Number(selectedPriceRange[1]);
      }

      // checking all condtion to be true
      if (isPriceOk && isSizeOk && isColorOk && isBrandOk && isGenderOk) {
        return true;
      }
    });
    return productsToReturn;
  };

  return (
    <div className="home-container">
      <section className="home-search-section">
        <div className="home-search-container">
          <input
            className="home-search-bar"
            type="text"
            name="searchIndividual"
            value={searchQuery}
            placeholder="Name, Brand, Color"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          <button
            onClick={handleSearchButtonClick}
            className="home-search-button"
          >
            <BiSearch />
          </button>
        </div>
        <div className="home-show-filter-container">
          <button onClick={toggleFilter} className="home-show-filter-button">
            <span>Filters</span> <BiFilterAlt />
          </button>
        </div>
      </section>
      <div className="home-products-container">
        <section
          className={`home-products-filters-section  ${
            filterExpand ? "expand-filter-section" : ""
          }`}
        >
          <div className="filters-header">
            <h4>Filters</h4>
            <button onClick={toggleFilter} className="filters-close-button">
              Close
            </button>
          </div>
          <div className="filters-sub-container">
            <h5>Category</h5>
            <div className="filter-checkbox-container">
              <input
                type="checkbox"
                value="men"
                onChange={handleGenderCheckboxChange}
                checked={selectedGenders.includes("men")}
                id="filter-input-men"
              />
              <label htmlFor="filter-input-men">Men</label>
            </div>
            <div className="filter-checkbox-container">
              <input
                type="checkbox"
                value="women"
                onChange={handleGenderCheckboxChange}
                checked={selectedGenders.includes("women")}
                id="filter-input-women"
              />
              <label htmlFor="filter-input-women">Women</label>
            </div>
          </div>
          <div className="filters-sub-container filters-price-container">
            <h5>Price Range</h5>
            <div className="filter-price-container">
              <label htmlFor="filter-min-price-input">Min</label>
              <input
                type="number"
                id="filter-min-price-input"
                className="filter-min-price-input"
                value={selectedPriceRange[0]}
                onChange={(e) => {
                  setSelectedPriceRange((v) => [e.target.value, v[1]]);
                }}
              />
            </div>
            <div className="filter-price-container">
              <label htmlFor="filter-max-price-input">Max</label>
              <input
                type="number"
                id="filter-max-price-input"
                className="filter-max-price-input"
                value={selectedPriceRange[1]}
                onChange={(e) => {
                  setSelectedPriceRange((v) => [v[0], e.target.value]);
                }}
              />
            </div>
          </div>
          <div className="filters-sub-container filters-brand-container">
            <h5>Brands</h5>
            {shoeBrands &&
              shoeBrands.map((brand) => (
                <div key={brand} className="filter-checkbox-container">
                  <input
                    type="checkbox"
                    id={`for-label-${brand}`}
                    onChange={handleBrandCheckboxChange}
                    checked={selectedBrands.includes(brand)}
                    value={`${brand}`}
                  />
                  <label htmlFor={`for-label-${brand}`}>{brand}</label>
                </div>
              ))}
          </div>
          <div className="filters-sub-container filters-size-container">
            <h5>Size</h5>
            {shoeSizes &&
              shoeSizes.map((size) => (
                <div key={size} className="filter-checkbox-container">
                  <input
                    type="checkbox"
                    id={`for-label-${size}`}
                    onChange={handleSizeCheckboxChange}
                    checked={selectedSizes.includes(`${size}`)}
                    value={size}
                  />
                  <label htmlFor={`for-label-${size}`}>{size} UK</label>
                </div>
              ))}
          </div>
          <div className="filters-sub-container filters-color-container">
            <h5>Colors</h5>
            {shoeColors &&
              shoeColors.map((color) => (
                <div key={color} className="filter-checkbox-container">
                  <input
                    type="checkbox"
                    onChange={handleColorCheckboxChange}
                    checked={selectedColors.includes(color)}
                    id={`for-label-${color}`}
                    value={`${color}`}
                  />
                  <label htmlFor={`for-label-${color}`}>{color}</label>
                </div>
              ))}
          </div>
          <div className="filter-apply-container">
            <button className="filter-apply-button" onClick={handleApplyFilter}>
              Apply
            </button>
            <button className="filter-reset-button" onClick={handleResetFilter}>
              Reset
            </button>
          </div>
        </section>
        <section className="home-products-display-section">
          {filteredProducts
            ? renderShoes(filteredProducts)
            : renderShoes(allShoes)}
        </section>
      </div>
    </div>
  );
};

export default Home;
