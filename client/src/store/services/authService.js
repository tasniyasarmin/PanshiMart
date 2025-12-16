import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authService = createApi({
  reducerPath: "auth",
  tagTypes: ["users"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      // prefer userToken, then generic token, then adminToken
      const token =
        state?.authReducer?.userToken ||
        state?.authReducer?.token ||
        state?.authReducer?.adminToken ||
        "";
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      authLogin: builder.mutation({
        query: (loginData) => {
          return {
            url: "login",
            method: "POST",
            body: loginData,
          };
        },
      }),
      userRegister: builder.mutation({
        query: (data) => {
          return {
            url: "/register",
            method: "POST",
            body: data,
          };
        },
      }),
      userLogin: builder.mutation({
        query: (loginData) => {
          return {
            url: "/login",
            method: "POST",
            body: loginData,
          };
        },
      }),
      getUser: builder.query({
        query: (id) => {
          return {
            url: `/user/${id}`, // Make sure your backend has this route!
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),
      getUsers: builder.query({
        query: (page) => {
          return {
            url: `/users/${page}`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),

      deleteUser: builder.mutation({
        query: (id) => {
          return {
            url: `/delete-user/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["users"],
      }),

      updateUser: builder.mutation({
        query: ({ id, ...data }) => {
          return {
            url: `/update-user/${id}`,
            method: "PUT",
            body: data,
          };
        },
        invalidatesTags: ["users"],
      }),
    };
  },
});
export const {
  useAuthLoginMutation,
  useUserRegisterMutation,
  useUserLoginMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = authService;
export default authService;
