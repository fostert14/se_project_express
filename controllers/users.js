const User = require("../models/users");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const createUser = (req, res) => {
  console.log(req.body);

  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid data passed" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
      );
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  console.log(userId);

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
      );
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID format" });
      }
      return res.status(err.statusCode || SERVER_ERROR).send({
        message: err.message || "An error has occurred on the server",
      });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
