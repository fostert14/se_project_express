const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NotFoundError } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

router.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

module.exports = router;
