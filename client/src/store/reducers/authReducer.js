import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
const customerToken = localStorage.getItem("userToken");

function verifyToken(keyName) {
  const storage = localStorage.getItem(keyName);
  if (storage) {
    const decodeToken = jwtDecode(storage);
    const expiresIn = new Date(decodeToken.exp * 1000);
    if (new Date() > expiresIn) {
      localStorage.removeItem(keyName);
      return null;
    } else {
      return storage;
    }
  } else {
    return null;
  }
}
const authReducer = createSlice({
  name: "authReducer",
  initialState: {
    adminToken: verifyToken("admin-token"),
    userToken: verifyToken("userToken"),
    user: customerToken ? jwtDecode(customerToken) : null,
  },
  reducers: {
    setAdminToken: (state, action) => {
      state.adminToken = action.payload;
    },
    setUserToken: (state, action) => {
      state.userToken = action.payload;
      state.user = jwtDecode(action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (e) {
        /* ignore */
      }
    },
    logout: (state) => {
      localStorage.removeItem("admin-token");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");

      state.adminToken = null;
      state.userToken = null;
      state.user = null;
    },
  },
});
export const { setAdminToken, setUserToken, setUser, logout } =
  authReducer.actions;
export default authReducer.reducer;
