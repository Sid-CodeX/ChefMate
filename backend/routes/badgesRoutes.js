const express = require("express");
const router = express.Router();
const badgeController = require("../controllers/badgeController");
const { authenticateUser } = require("../middlewares/authMiddleware"); 

router.get("/user", authenticateUser, badgeController.getUserBadges);
router.get("/all", badgeController.getAllBadgeMetadata);

module.exports = router;
