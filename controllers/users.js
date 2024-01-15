const User = require("../models/users");
const bcrypt = require("bcryptjs");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  DUPLICATE_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

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
      } else if (err.code === 11000) {
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: "Invalid data passed" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Internal server error" });
      }
    });
};

// const getUsers = (req, res) => {
//   User.find({})
//     .then((items) => res.send(items))
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
//       );
//       res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const getUser = (req, res) => {
//   const { userId } = req.params;

//   console.log(userId);

//   User.findById(userId)
//     .orFail(() => {
//       const error = new Error("User not found");
//       error.statusCode = NOT_FOUND;
//       throw error;
//     })
//     .then((user) => {
//       res.status(200).send(user);
//     })
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
//       );
//       if (err.name === "CastError") {
//         return res.status(INVALID_DATA).send({ message: "Invalid ID format" });
//       }
//       return res.status(err.statusCode || SERVER_ERROR).send({
//         message: err.message || "An error has occurred on the server",
//       });
//     });
// };

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
