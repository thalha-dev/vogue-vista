import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import NavbarLayout from "./components/layouts/NavbarLayout";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import WishList from "./components/WishList";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavbarLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="home" element={<Home />} />
        <Route path="wishlist" element={<WishList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>,
    ),
  );

  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
