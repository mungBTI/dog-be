const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/", isAuthenticated, userController.getMyProfile);

module.exports = router;
