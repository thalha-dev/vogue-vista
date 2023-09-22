import { useDispatch, useSelector } from "react-redux";
import {
  getUserOrders,
  getUserOrdersStatusCB,
  ordersCB,
} from "../../state/slice/shoeSlice";
import { getLoginStatusCB } from "../../state/slice/userSlice";
import { useEffect } from "react";
import { formatMongoDbTimeStamp, numberToInr } from "../utils/utils";
import { Link } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(ordersCB);
  const getUserOrdersStatus = useSelector(getUserOrdersStatusCB);
  const loginStatus = useSelector(getLoginStatusCB);

  useEffect(() => {
    if (loginStatus === "success" && getUserOrdersStatus !== "success") {
      dispatch(getUserOrders());
    }
  }, [loginStatus, getUserOrdersStatus]);

  return (
    getUserOrdersStatus === "success" && (
      <div className="orders-page-container">
        <section className="orders-section">
          {orders &&
            orders.map((order) => (
              <div key={order._id} className="order-container">
                <div className="order-products-list">
                  <div className="order-product-container">
                    <div className="order-shoe-name">Name</div>
                    <div className="order-shoe-count">Count</div>
                  </div>
                  {order.productsInOrder.map((ob) => (
                    <Link
                      className="order-product-container"
                      to={`/singleProduct/${ob.shoe._id}`}
                      key={ob.shoe._id}
                    >
                      <div className="order-shoe-name">{ob.shoe.shoeName}</div>
                      <div className="order-shoe-count">{ob.shoeCount}</div>
                    </Link>
                  ))}
                </div>
                <div className="order-price-container">
                  <span className="order-price-label">Total</span>
                  <span className="order-price">
                    {numberToInr(order.orderPrice)}
                  </span>
                </div>
                <div className="order-date-time">
                  {formatMongoDbTimeStamp(order.createdAt)}
                </div>
              </div>
            ))}
        </section>
      </div>
    )
  );
};

export default Orders;
