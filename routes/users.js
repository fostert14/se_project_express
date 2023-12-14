const router = require("express").Router();

const { createUser, getUsers, getUser } = require("../controllers/users");

//Create
router.post("/", createUser);

//Read
//get all Users
router.get("/", getUsers);
//get Specific User

router.get("/:userId", getUser);

//router.get("/", getUsers);

module.exports = router;
