const ClothingItem = require("../models/clothingItems");
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.user._id);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
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
    .then((items) => res.status(200).send(items))
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

  console.log(itemId);

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found " });
      }
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({ message: "Forbidden to delete this item " });
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      if (deletedItem) {
        res
          .status(200)
          .send({ message: "Item deleted successfully", item: deletedItem });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "Internal server error" });
    });
};

// OLD DELETE FUNCITONALITY
// ClothingItem.findByIdAndDelete(itemId)
//   .orFail(() => {
//     const error = new Error("Item not found");
//     error.statusCode = NOT_FOUND;
//     throw error;
//   })
//   .then((item) => res.status(200).send({ item }))
//   .catch((err) => {
//     console.error(
//       `Error ${err.name} with the message ${err.message} has occurred while executing the code`,
//     );
//     if (err.name === "CastError") {
//       return res.status(INVALID_DATA).send({ message: "Invalid ID format" });
//     }
//     return res.status(err.statusCode || SERVER_ERROR).send({
//       message: err.message || "An error has occurred on the server",
//     });
//   });

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
    { $pull: { likes: req.user._id } }, // Remove _id from the array
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
