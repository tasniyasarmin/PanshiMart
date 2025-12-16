import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import Nav from "../../../components/home/Nav";
import { useUserRegisterMutation } from "../../../store/services/authService";
import { setUserToken } from "../../../store/reducers/authReducer";
import { setSuccess } from "../../../store/reducers/globalReducer";
import { showError } from "../../../utils/ShowError";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const [errors, setErrors] = useState([]);
  const [registerUser, response] = useUserRegisterMutation();

  // Generate random avatar on mount
  useEffect(() => {
    generateRandomAvatar();
  }, []);

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;
    setState((prev) => ({ ...prev, image: newAvatarUrl }));
  };

  const handleInputs = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    registerUser(state);
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
      dispatch(setSuccess(response?.data?.msg));
      navigate("/user");
    }
  }, [
    response.isSuccess,
    dispatch,
    navigate,
    response?.data?.msg,
    response?.data?.token,
  ]);

  return (
    <>
      <Nav />
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join us to start your journey
            </p>
          </div>

          {/* Avatar Preview Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 shadow-sm bg-gray-50">
                {state.image && (
                  <img
                    src={state.image}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={generateRandomAvatar}
                className="absolute bottom-0 right-0 bg-white text-indigo-600 p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Generate new avatar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <span className="text-xs text-gray-400 mt-2">
              Your unique avatar
            </span>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={state.name}
                  onChange={handleInputs}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    showError(errors, "name")
                      ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500"
                      : "border-gray-300 bg-gray-50 text-gray-900 focus:ring-indigo-500 bg-opacity-50"
                  } rounded-lg focus:outline-none sm:text-sm transition-colors duration-200`}
                  placeholder="John Doe"
                />
              </div>
              {showError(errors, "name") && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {showError(errors, "name")}
                </p>
              )}
            </div>

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
                  type="email"
                  name="email"
                  id="email"
                  value={state.email}
                  onChange={handleInputs}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    showError(errors, "email")
                      ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500"
                      : "border-gray-300 bg-gray-50 text-gray-900 focus:ring-indigo-500 bg-opacity-50"
                  } rounded-lg focus:outline-none sm:text-sm transition-colors duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {showError(errors, "email") && (
                <p className="mt-1 text-sm text-red-600 font-medium">
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
                  type="password"
                  name="password"
                  id="password"
                  value={state.password}
                  onChange={handleInputs}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                    showError(errors, "password")
                      ? "border-red-300 bg-red-50 text-red-900 focus:ring-red-500"
                      : "border-gray-300 bg-gray-50 text-gray-900 focus:ring-indigo-500 bg-opacity-50"
                  } rounded-lg focus:outline-none sm:text-sm transition-colors duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {showError(errors, "password") && (
                <p className="mt-1 text-sm text-red-600 font-medium">
                  {showError(errors, "password")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={response.isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  ${
                    response.isLoading
                      ? "bg-indigo-400 cursor-wait"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg"
                  } transition-all duration-200`}
              >
                {response.isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
