import { BiSearch } from "react-icons/bi";
import { useState } from "react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="home-container">
      <section className="home-search">
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
      </section>
    </div>
  );
};

export default Home;
