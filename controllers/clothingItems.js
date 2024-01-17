const { default: mongoose } = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const {
  INVALID_DATA,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED_USER,
} = require("../utils/errors");

const { isValidObjectId } = mongoose;

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      return res.send({ data: item });
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
      );
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    return res.status(INVALID_DATA).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(UNAUTHORIZED_USER)
          .send({ message: "Forbidden to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      if (deletedItem) {
        return res
          .status(200)
          .send({ message: "Item deleted successfully", item: deletedItem });
      }
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID format" });
      }
      console.error(err);
      return res.status(err.statusCode || SERVER_ERROR).send({
        message: err.message || "An error has occurred on the server",
      });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid ID format" });
      }
      console.error(err);
      return res.status(err.statusCode || SERVER_ERROR).send({
        message: err.message || "An error has occurred on the server",
      });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: "Error from updateItem", e });
//     });
// };

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
