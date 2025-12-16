import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import Spinner from "../../components/Spinner";
import { setSuccess, clearMessage } from "../../store/reducers/globalReducer";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../store/services/authService";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Fetch user data by ID
  const { data: userData, isFetching } = useGetUserQuery(id);

  // 2. Mutation for updating
  const [updateUser, response] = useUpdateUserMutation();

  const [state, setState] = useState({
    name: "",
    email: "",
    admin: false,
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (userData?.user) {
      setState({
        name: userData.user.name,
        email: userData.user.email,
        admin: userData.user.admin,
      });
    }
  }, [userData]);

  // Handle success message and redirect
  useEffect(() => {
    if (response.isSuccess) {
      dispatch(setSuccess(response?.data?.message));
      navigate("/dashboard/users");
    }
  }, [response.isSuccess, dispatch, navigate, response?.data?.message]);

  // Handle errors
  useEffect(() => {
    if (response?.error?.data?.errors) {
      response.error.data.errors.forEach((err) => {
        toast.error(err.msg);
      });
    }
  }, [response?.error?.data?.errors]);

  const handleInput = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setState({ ...state, admin: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ id, ...state });
  };

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/dashboard/users" className="btn-dark">
          <i className="bi bi-arrow-left-short"></i> users list
        </Link>
      </ScreenHeader>
      <Toaster position="top-right" />

      {!isFetching ? (
        <div className="flex flex-wrap -mx-3">
          <form className="w-full xl:w-8/12 p-3" onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-6/12 p-3">
                <label htmlFor="name" className="label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="name"
                  placeholder="User Name..."
                  value={state.name}
                  onChange={handleInput}
                />
              </div>
              <div className="w-full md:w-6/12 p-3">
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="email"
                  placeholder="email@example.com"
                  value={state.email}
                  onChange={handleInput}
                  disabled // Often you don't want to let admins change emails easily
                />
              </div>

              <div className="w-full p-3">
                <label
                  htmlFor="admin"
                  className="label cursor-pointer flex items-center"
                >
                  <input
                    type="checkbox"
                    name="admin"
                    id="admin"
                    checked={state.admin}
                    onChange={handleCheckbox}
                    className="w-5 h-5 mr-2"
                  />
                  <span>Is Admin?</span>
                </label>
              </div>

              <div className="w-full p-3">
                <input
                  type="submit"
                  value={response.isLoading ? "loading..." : "update user"}
                  disabled={response.isLoading}
                  className="btn btn-indigo"
                />
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};

export default EditUser;
