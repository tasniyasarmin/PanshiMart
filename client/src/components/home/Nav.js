import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { BsHandbag } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import Search from "./Search";
import { toggleSearchBar } from "../../store/reducers/globalReducer";

const Nav = () => {
  const { userToken, user } = useSelector((state) => state.authReducer);
  const { searchBar } = useSelector((state) => state.globalReducer);
  const { items } = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();

  return (
    <>
      <nav className="nav">
        <div className="my-container">
          <div className="flex justify-between items-center">
            {/* --- LOCAL SVG SECTION START --- */}
            <Link to="/" className="flex flex-col items-center gap-1">
              {/* 2. Use the imported variable in the src */}
              <img
                src="/mart.svg"
                alt="Shop"
                className="w-7 h-7 object-contain"
              />
              <span className="text-sm font-bold text-gray-800 tracking-wide">
                PanshiMart
              </span>
            </Link>
            {/* --- LOCAL SVG SECTION END --- */}

            <ul className="flex items-center">
              <li className="nav-li cursor-pointer">
                <FiSearch
                  size={22}
                  onClick={() => dispatch(toggleSearchBar())}
                />
              </li>
              {userToken ? (
                <li className="nav-li">
                  <Link to="/user" className="nav-link">
                    {user?.name}
                  </Link>
                </li>
              ) : (
                <li className="nav-li">
                  <Link to="/login" className="nav-link">
                    sign in
                  </Link>
                </li>
              )}

              <li className="nav-li relative">
                <Link to="/cart">
                  <BsHandbag size={20} />
                  <span className="nav-circle">{items}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Search />
    </>
  );
};

export default Nav;
