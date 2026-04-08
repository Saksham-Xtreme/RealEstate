// layouts/EmployeeLayout.jsx
import { Outlet, Link } from "react-router-dom";

const EmployeeLayout = () => {
  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white p-4 space-y-4">
        <h1 className="text-xl font-bold">CRM Panel</h1>

        <Link to="/employee/home" className="block">
          Dashboard
        </Link>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-red-400"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;