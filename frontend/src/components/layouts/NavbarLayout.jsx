import { NavLink, Outlet } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { useState } from "react";

const NavbarLayout = () => {
  const [toggleValue, setToggleValue] = useState(false);

  const handleToggle = () => {
    setToggleValue(!toggleValue);
  };

  return (
    <>
      <header className="site-header">
        <NavLink className="site-title" to="/">
          <h2>Vogue Vista</h2>
        </NavLink>

        <button
          className={`nav-btn ${toggleValue ? "position-fixed" : ""}`}
          onClick={handleToggle}
        >
          {toggleValue ? <GrClose /> : <BiMenu />}
        </button>
        <div className={`nav-container ${toggleValue ? "btn-toggle" : ""}`}>
          <nav className="site-nav">
            <ul>
              <li>
                <NavLink to="/home">Home</NavLink>
              </li>
              <li>
                <NavLink to="/wishlist">Wish List</NavLink>
              </li>
              <li>
                <NavLink to="/orders">Orders</NavLink>
              </li>
              <li>
                <NavLink to="/cart">Cart</NavLink>
              </li>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Signup</NavLink>
              </li>
              <li>
                <NavLink to="/">Logout</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default NavbarLayout;
