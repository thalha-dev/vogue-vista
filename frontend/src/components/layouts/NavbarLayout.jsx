import { Link, NavLink, Outlet } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminRoleStatusCB,
  getLoginStatusCB,
  logout,
} from "../../../state/slice/userSlice";
import {
  getAllShoes,
  getAllShoesFromCart,
  getAllShoesFromWishList,
} from "../../../state/slice/shoeSlice";

const NavbarLayout = () => {
  const [toggleValue, setToggleValue] = useState(false);
  const loginStatus = useSelector(getLoginStatusCB);
  const isAdmin = useSelector(getAdminRoleStatusCB);
  const dispatch = useDispatch();

  useEffect(() => {
    // initial fetch
    if (loginStatus === "success") {
      dispatch(getAllShoes());
      dispatch(getAllShoesFromCart());
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
      <div className="site-content">
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
                {loginStatus === "success" && isAdmin ? (
                  <li>
                    <NavLink to="/adminspace">Admin</NavLink>
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
                    <Link onClick={handleLogout} to="/">
                      Logout
                    </Link>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </nav>
          </div>
        </header>
        <Outlet />
      </div>
      <footer className="site-footer">
        <div>
          <p>&copy; 2023 Vogue Vista</p>
        </div>
      </footer>
    </>
  );
};

export default NavbarLayout;
