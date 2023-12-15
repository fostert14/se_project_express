const router = require("express").Router();

const { createUser, getUsers, getUser } = require("../controllers/users");

// Create
router.post("/", createUser);

// Get all Users
router.get("/", getUsers);
// Get Specific User

router.get("/:userId", getUser);

// Router.get("/", getUsers);

module.exports = router;
