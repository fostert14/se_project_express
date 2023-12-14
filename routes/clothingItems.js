const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

//Create
router.post("/", createItem);

//Read

router.get("/", getItems);

//Delete

router.delete("/:itemId", deleteItem);

module.exports = router;
