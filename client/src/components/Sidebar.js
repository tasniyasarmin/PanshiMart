import { Link } from "react-router-dom";

const Sidebar = ({ side, closeSidebar }) => {
  return (
    <div
      className={`fixed top-0 ${side} sm:left-0 w-64 h-screen bg-gray-800 z-10 transition-all flex flex-col`}
    >
      <i
        className="bi bi-x-lg absolute top-4 right-4 sm:hidden block cursor-pointer text-lg text-white"
        onClick={closeSidebar}
      ></i>

      {/* --- LOGO SECTION START --- */}
      <div className="p-6 flex flex-col items-center justify-center gap-2">
        <img src="/mart.svg" alt="logo" className="w-10 h-10 object-contain" />
        <span className="text-base font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase">
          PanshiMart
        </span>
      </div>
      {/* --- LOGO SECTION END --- */}

      <ul className="mt-4 flex-1">
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-700">
          <i className="bi bi-card-list mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/products" className="text-base capitalize">
            products
          </Link>
        </li>
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-700">
          <i className="bi bi-bag-check mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/orders" className="text-base capitalize">
            orders
          </Link>
        </li>
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-700">
          <i className="bi bi-people-fill mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/users" className="text-base capitalize">
            customers
          </Link>
        </li>
        <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-700">
          <i className="bi bi-bar-chart mr-2 inline-block text-lg"></i>{" "}
          <Link to="/dashboard/categories" className="text-base capitalize">
            categories
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
