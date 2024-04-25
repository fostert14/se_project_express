const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateClothingItemCreation,
  validateId,
} = require("../middlewares/validation");

// Create
router.post("/", auth, validateClothingItemCreation, createItem);

// Read

router.get("/", getItems);

// Delete

router.delete("/:itemId", auth, validateId, deleteItem);

// Like an item

router.put("/:itemId/likes", auth, validateId, likeItem);

// Unlike an item

router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
