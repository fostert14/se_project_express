const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { update } = require("../models/users");

router.get("/me", auth, getCurrentUser);

router.patch("/users/me", auth, updateCurrentUser);

module.exports = router;
