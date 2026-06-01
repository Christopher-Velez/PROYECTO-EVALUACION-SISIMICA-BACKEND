import { Router } from "express";
// Importamos las funciones específicas del controlador
import { getAvailableHelpers, createAssignment } from "../controllers/assignmentController.js";
// Importamos tu middleware de autenticación (ajusta la ruta según tu proyecto)
import { authenticateToken } from "../middlewares/authMiddleware.js"; 

const router = Router();

// GET /api/assignments/helpers/available -> Obtiene ayudantes activos
router.get("/helpers/available", authenticateToken, getAvailableHelpers);

// POST /api/assignments -> Crea la asignación y la notificación
router.post("/", authenticateToken, createAssignment);

export default router;