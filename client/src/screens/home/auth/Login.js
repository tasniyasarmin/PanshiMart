import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setUserToken } from "../../../store/reducers/authReducer";
import Nav from "../../../components/home/Nav";
import { useUserLoginMutation } from "../../../store/services/authService";
import { useForm } from "../../../hooks/Form";
import { showError } from "../../../utils/ShowError";

const Login = () => {
  const [errors, setErrors] = useState([]);
  const { state, onChange } = useForm({
    email: "",
    password: "",
  });

  const [loginUser, response] = useUserLoginMutation();

  const onSubmit = (e) => {
    e.preventDefault();
    loginUser(state);
  };

  useEffect(() => {
    if (response.isError) {
      setErrors(response?.error?.data?.errors);
    }
  }, [response?.error?.data]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (response.isSuccess) {
      localStorage.setItem("userToken", response?.data?.token);
      dispatch(setUserToken(response?.data?.token));
      navigate("/user");
    }
  }, [response.isSuccess, dispatch, navigate]);

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please sign in to your account
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={state.email}
                    onChange={onChange}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      showError(errors, "email")
                        ? "border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 bg-opacity-50"
                    } rounded-lg focus:outline-none sm:text-sm transition-colors duration-200`}
                    placeholder="you@example.com"
                  />
                </div>
                {showError(errors, "email") && (
                  <p className="mt-1 text-sm text-red-600 font-medium animate-pulse">
                    {showError(errors, "email")}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                    id="password"
                    name="password"
                    type="password"
                    value={state.password}
                    onChange={onChange}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                      showError(errors, "password")
                        ? "border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 bg-opacity-50"
                    } rounded-lg focus:outline-none sm:text-sm transition-colors duration-200`}
                    placeholder="••••••••"
                  />
                </div>
                {showError(errors, "password") && (
                  <p className="mt-1 text-sm text-red-600 font-medium animate-pulse">
                    {showError(errors, "password")}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={response.isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white 
                  ${
                    response.isLoading
                      ? "bg-indigo-400 cursor-wait"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg"
                  } transition-all duration-200`}
              >
                {response.isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Register now
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
