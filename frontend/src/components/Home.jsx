import { BiSearch } from "react-icons/bi";
import { BiFilterAlt } from "react-icons/bi";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  getShoeBrandsCB,
  getShoeColorsCB,
  getshoeSizesCB,
} from "../../state/slice/shoeSlice";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExpand, setFilterExpand] = useState(false);
  const shoeBrands = useSelector(getShoeBrandsCB);
  const shoeSizes = useSelector(getshoeSizesCB);
  const shoeColors = useSelector(getShoeColorsCB);

  const toggleFilter = () => {
    setFilterExpand(!filterExpand);
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
          <button className="home-search-button">
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
              <input type="checkbox" value="men" id="filter-input-men" />
              <label htmlFor="filter-input-men">Men</label>
            </div>
            <div className="filter-checkbox-container">
              <input type="checkbox" id="filter-input-women" value="women" />
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
              />
            </div>
            <div className="filter-price-container">
              <label htmlFor="filter-max-price-input">Max</label>
              <input
                type="number"
                id="filter-max-price-input"
                className="filter-max-price-input"
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
                    value={`${size}`}
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
                    id={`for-label-${color}`}
                    value={`${color}`}
                  />
                  <label htmlFor={`for-label-${color}`}>{color}</label>
                </div>
              ))}
          </div>
          <div className="filter-apply-container">
            <button className="filter-apply-button">Apply</button>
            <button className="filter-reset-button">Reset</button>
          </div>
        </section>
        <section className="home-products-display-section"></section>
      </div>
    </div>
  );
};

export default Home;
