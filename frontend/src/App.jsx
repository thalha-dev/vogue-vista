import "react-toastify/dist/ReactToastify.css";
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
import SingleProduct from "./components/SingleProduct";
import UploadShoe from "./components/UploadShoe";
import AdminLayout from "./components/layouts/AdminLayout";
import CurrentOrderSummary from "./components/CurrentOrderSummary";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccessPage from "./components/PaymentSuccessPage";

function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavbarLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="home" element={<Home />} />
        <Route path="wishlist" element={<WishList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="singleProduct/:id" element={<SingleProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route
          path="currentOrderSummary/:orderType"
          element={<CurrentOrderSummary />}
        />
        <Route path="login" element={<Login />} />
        <Route
          path="payment/:id/:orderType/:deliveryAddress"
          element={<PaymentPage />}
        />
        <Route path="paymentSuccess" element={<PaymentSuccessPage />} />
        <Route path="signup" element={<Signup />} />
        {/* admin routes */}
        <Route path="adminspace" element={<AdminLayout />}>
          <Route path="uploadShoe" element={<UploadShoe />} />
        </Route>
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
