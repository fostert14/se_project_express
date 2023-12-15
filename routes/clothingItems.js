const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", createItem);

// Read

router.get("/", getItems);

// Delete

router.delete("/:itemId", deleteItem);

// Like an item

router.put("/:itemId/likes", likeItem);

// Unlike an item

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
