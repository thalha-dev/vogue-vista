import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <nav className="admin-layout-navbar">
        <div className="admin-layout-link-container">
          <NavLink to="uploadShoe">Upload Shoe</NavLink>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
