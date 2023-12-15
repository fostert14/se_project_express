const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res, next) => {
  const error = new Error("Requested resource not found");
  error.statusCode = NOT_FOUND;
  next(error);
});

router.use((err, req, res) => {
  console.error(err);
  const status = err.statusCode || SERVER_ERROR;
  const message = err.message || "An error has occurred on the server";
  res.status(status).send({ message });
});

module.exports = router;
