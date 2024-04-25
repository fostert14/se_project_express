const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { validateId } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateCurrentUser);

module.exports = router;
