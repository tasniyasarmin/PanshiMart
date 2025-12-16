const { validationResult } = require("express-validator");
const UserModel = require("../models/User");
const {
  hashedPassword,
  createToken,
  comparePassword,
} = require("../services/authServices");

// @route POST /api/register
// @access Public
// @desc Create user and return a token
module.exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { name, email, password, image } = req.body;
    try {
      const emailExist = await UserModel.findOne({ email });
      if (!emailExist) {
        const hashed = await hashedPassword(password);
        const user = await UserModel.create({
          name,
          email,
          password: hashed,
          image,
        });
        const token = createToken({ id: user._id, name: user.name });
        return res
          .status(201)
          .json({ msg: "Your account has been created!", token });
      } else {
        // email already taken
        return res.status(400).json({
          errors: [{ msg: `${email} is already taken`, param: "email" }],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  } else {
    // validations failed
    return res.status(400).json({ errors: errors.array() });
  }
};

// @route POST /api/login
// @access Public
// @desc Login user and return a token

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        if (await comparePassword(password, user.password)) {
          const token = createToken({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.admin ? "admin" : "user",
          });
          if (user.admin) {
            return res.status(201).json({ token, admin: true });
          } else {
            return res.status(201).json({ token, admin: false });
          }
        } else {
          return res.status(400).json({
            errors: [{ msg: "password not matched!", param: "password" }],
          });
        }
      } else {
        return res.status(400).json({
          errors: [{ msg: `${email} is not found!`, param: "email" }],
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  } else {
    //  validations failed
    return res.status(400).json({ errors: errors.array() });
  }
};

// @route GET /api/users
// @access Admin
// @desc Get all users (admin only)
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, "-password"); // Exclude password field
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};

// @route GET /api/users/:id
// @access Admin
// @desc Get user by id (admin only)
module.exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id, "-password"); // Exclude password field
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};

// @route DELETE /api/users/:id
// @access Admin
// @desc Delete user by id (admin only)
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: "User has deleted successfully!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};

// @route PUT /api/users/:id
// @access Admin
// @desc Update user by id (admin only)
module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Prevent changing _id
    if (updates._id) delete updates._id;

    // If password is included in update, hash it before saving
    if (updates.password) {
      try {
        updates.password = await hashedPassword(updates.password);
      } catch (hashErr) {
        console.error("Password hashing failed:", hashErr);
        return res.status(500).json({ error: "Server error" });
      }
    }

    // Use the correct model name (UserModel)
    const user = await UserModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      context: "query",
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      msg: "User has updated successfully!",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

// @route PUT /api/users/:id
// @access Admin
// @desc Update user by id (admin only)
module.exports.updateUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  try {
    await UserModel.findByIdAndUpdate(id, { admin });
    return res.status(200).json({ msg: "User has updated successfully!" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json("Server internal error!");
  }
};
