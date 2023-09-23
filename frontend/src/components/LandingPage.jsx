import { Link } from "react-router-dom";
import modelImage from "../assets/landing-page-model.png";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <section className="hero-section">
        <h1>Fashion That Walks With You</h1>
        <p>
          Explore an exquisite collection of shoes curated for every style and
          occasion.
        </p>
        <Link className="hero-shop-now-link" to="/home">
          Shop Now
        </Link>
      </section>
      <section className="landing-page-image-section">
        <img
          className="landing-page-model-image"
          src={modelImage}
          alt="landing page image"
        />
      </section>
    </div>
  );
};

export default LandingPage;
