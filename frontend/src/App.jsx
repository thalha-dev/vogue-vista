import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useSelector } from "react-redux";

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
import ProductsAdminView from "./components/ProductsAdminView";

import {
  getAdminRoleStatusCB,
  getLoginStatusCB,
} from "../state/slice/userSlice";
import UpdateShoe from "./components/UpdateShoe";
import NotFound from "./components/NotFound";

function App() {
  const loginStatus = useSelector(getLoginStatusCB);
  const adminStatus = useSelector(getAdminRoleStatusCB);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<NavbarLayout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="home"
          element={loginStatus === "success" ? <Home /> : <Login />}
        />
        <Route
          path="wishlist"
          element={loginStatus === "success" ? <WishList /> : <Login />}
        />
        <Route path="cart" element={<Cart />} />
        <Route
          path="singleProduct/:id"
          element={loginStatus === "success" ? <SingleProduct /> : <Login />}
        />
        <Route
          path="orders"
          element={loginStatus === "success" ? <Orders /> : <Login />}
        />
        <Route
          path="currentOrderSummary/:orderType"
          element={
            loginStatus === "success" ? <CurrentOrderSummary /> : <Login />
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="payment/:id/:orderType/:deliveryAddress"
          element={loginStatus === "success" ? <PaymentPage /> : <Login />}
        />
        <Route
          path="paymentSuccess"
          element={
            loginStatus === "success" ? <PaymentSuccessPage /> : <Login />
          }
        />
        {/* admin routes */}
        <Route
          path="adminspace"
          element={
            loginStatus === "success" && adminStatus ? (
              <AdminLayout />
            ) : (
              <Login />
            )
          }
        >
          <Route
            path="uploadShoe"
            element={
              loginStatus === "success" && adminStatus ? (
                <UploadShoe />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="productsAdminView"
            element={
              loginStatus === "success" && adminStatus ? (
                <ProductsAdminView />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="updateShoe/:shoeId"
            element={
              loginStatus === "success" && adminStatus ? (
                <UpdateShoe />
              ) : (
                <Login />
              )
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
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
