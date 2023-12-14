const User = require("../models/users");

const createUser = (req, res) => {
  console.log(req.body);

  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createUser", e });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getUsers", e });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  console.log(userId);
  User.findById(userId)
    .then((item) => res.status(200).send(item))
    .catch((e) => {
      res.status(500).send({ message: "Error from getUser", e });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
