import { useState, useEffect } from "react";
import { useAuthLoginMutation } from "../../store/services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "../../store/reducers/authReducer";
// Import standard SweetAlert2
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleInputs = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const [login, response] = useAuthLoginMutation();

  const errors = response?.error?.data?.errors
    ? response?.error?.data?.errors
    : [];

  const adminLoginFunction = (e) => {
    e.preventDefault();
    login(state);
  };

  useEffect(() => {
    if (response.isSuccess) {
      const isAdmin = response?.data?.admin;

      if (isAdmin) {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back, Admin.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#1f2937",
          color: "#fff",
        });

        localStorage.setItem("admin-token", response?.data?.token);
        dispatch(setAdminToken(response?.data?.token));
        navigate("/dashboard/products");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Access Denied",
          text: "You do not have admin privileges.",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#d33",
        });
      }
    }
  }, [response.isSuccess, response.data, dispatch, navigate]);

  // Error Handling
  useEffect(() => {
    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        html: errors.map((err) => err.msg).join("<br>"),
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#d33",
      });
    }
  }, [errors]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <form
          className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-2xl w-full"
          onSubmit={adminLoginFunction}
        >
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h3>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <div className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                className="w-full bg-black/40 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3.5 placeholder-gray-500 transition-all duration-200 ease-in-out outline-none"
                onChange={handleInputs}
                value={state.email}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                className="w-full bg-black/40 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3.5 placeholder-gray-500 transition-all duration-200 ease-in-out outline-none"
                onChange={handleInputs}
                value={state.password}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={response.isLoading}
              className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                            ${
                              response.isLoading
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-150"
                            }`}
            >
              {response.isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
