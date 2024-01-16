const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  DUPLICATE_ERROR,
  INVALID_CREDENTIALS,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  console.log(req.body);

  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)

    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.send({ data: userObj });
      }),
    )

    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid data passed" });
      }
      if (err.code === 11000) {
        return res
          .status(DUPLICATE_ERROR)
          .send({ message: "This email is already being used" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "Internal server error" });
    });
};

const updateCurrentUser = (req, res) => {
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.avatar) updates.avatar = req.body.avatar;

  User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: "Invalid data passed" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Internal server error" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(INVALID_CREDENTIALS).send({ message: err.message });
      }
      console.err(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
