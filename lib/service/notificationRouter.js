import { Router } from "express";
import { getUserNotifications, markAsRead } from "../controllers/notificationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /api/notifications -> Obtiene las notificaciones del usuario logueado
router.get("/", authenticateToken, getUserNotifications);

// PATCH /api/notifications/:id/read -> Marca una notificación específica como leída
router.patch("/:id/read", authenticateToken, markAsRead);

export default router;