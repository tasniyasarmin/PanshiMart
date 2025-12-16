const express = require("express");
const {
  registerValidations,
  loginValidations,
} = require("../validations/userValidations");
const {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  updateUserAdmin,
} = require("../controllers/usersController");
const { authorized } = require("../services/Authorization");

const router = express.Router();
router.post("/register", registerValidations, register);
router.post("/login", loginValidations, login);
router.get("/users/:page", authorized, getAllUsers);
router.put("/update-user/:id", authorized, updateUser);
router.put("/update-user-admin/:id", authorized, updateUserAdmin);
router.delete("/delete-user/:id", authorized, deleteUser);
router.get("/user/:id", authorized, getUser);

module.exports = router;
