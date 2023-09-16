import { NavLink, Outlet } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLoginStatusCB, logout } from "../../../state/slice/userSlice";
import {
  getAllShoes,
  getAllShoesFromWishList,
} from "../../../state/slice/shoeSlice";

const NavbarLayout = () => {
  const [toggleValue, setToggleValue] = useState(false);
  const loginStatus = useSelector(getLoginStatusCB);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStatus === "success") {
      dispatch(getAllShoes());
      dispatch(getAllShoesFromWishList());
    }
  }, [loginStatus]);

  const handleToggle = () => {
    setToggleValue(!toggleValue);
  };

  const handleLogout = () => {
    dispatch(logout());
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
              {loginStatus === "success" ? (
                <li>
                  <NavLink to="/home">Home</NavLink>
                </li>
              ) : (
                ""
              )}
              {loginStatus === "success" ? (
                <li>
                  <NavLink to="/wishlist">Wish List</NavLink>
                </li>
              ) : (
                ""
              )}
              {loginStatus === "success" ? (
                <li>
                  <NavLink to="/orders">Orders</NavLink>
                </li>
              ) : (
                ""
              )}
              {loginStatus === "success" ? (
                <li>
                  <NavLink to="/cart">Cart</NavLink>
                </li>
              ) : (
                ""
              )}
              {loginStatus === "success" ? (
                ""
              ) : (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )}
              {loginStatus === "success" ? (
                ""
              ) : (
                <li>
                  <NavLink to="/signup">Signup</NavLink>
                </li>
              )}
              {loginStatus === "success" ? (
                <li>
                  <NavLink onClick={handleLogout} to="/">
                    Logout
                  </NavLink>
                </li>
              ) : (
                ""
              )}
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default NavbarLayout;
