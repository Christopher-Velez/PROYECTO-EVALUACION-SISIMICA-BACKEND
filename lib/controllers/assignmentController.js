import pool from "../config/db.js";

// Obtener ayudantes disponibles (activos)
export const getAvailableHelpers = async (req, res) => {
  try {
    const query = `
      SELECT id_usuario, nombre, email, telefono, foto_perfil_url 
      FROM usuarios 
      WHERE rol = 'ayudante' AND activo = true
    `;
    const result = await pool.query(query);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error obteniendo ayudantes:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Crear una nueva asignación
export const createAssignment = async (req, res) => {
  const { id_ayudante, id_edificio } = req.body;
  const id_inspector = req.user.id; // Viene del middleware de autenticación JWT

  try {
    // 1. Crear la asignación
    const assignQuery = `
      INSERT INTO asignaciones_ayudante (id_inspector, id_ayudante, id_edificio, estado)
      VALUES ($1, $2, $3, 'pendiente')
      RETURNING *
    `;
    const assignResult = await pool.query(assignQuery, [id_inspector, id_ayudante, id_edificio]);

    // 2. Obtener datos para la notificación
    const edifQuery = `SELECT nombre_edificio FROM edificios WHERE id_edificio = $1`;
    const edifResult = await pool.query(edifQuery, [id_edificio]);
    const nombreEdificio = edifResult.rows[0]?.nombre_edificio || 'un edificio';

    // 3. Crear notificación automática para el ayudante
    const notifQuery = `
      INSERT INTO notificaciones (id_usuario, titulo, mensaje, tipo)
      VALUES ($1, $2, $3, 'asignacion')
    `;
    await pool.query(notifQuery, [
      id_ayudante, 
      "Nueva Asignación", 
      `Has sido asignado para inspeccionar: ${nombreEdificio}`
    ]);

    res.status(201).json({ 
      success: true, 
      message: "Ayudante asignado correctamente y notificado",
      data: assignResult.rows[0] 
    });
  } catch (error) {
    if (error.code === '23505') { // Código de error de Postgres para UNIQUE violation
      return res.status(409).json({ success: false, error: "Este ayudante ya está asignado a este edificio por ti." });
    }
    console.error("Error creando asignación:", error);
    res.status(500).json({ success: false, error: "Error al crear la asignación" });
  }
};