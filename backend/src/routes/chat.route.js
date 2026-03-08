import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken, deleteMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.delete("/messages/:messageId", protectRoute, deleteMessage);

export default router;
