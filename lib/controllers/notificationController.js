import pool from "../config/db.js";

// Obtener las notificaciones del usuario logueado
export const getUserNotifications = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const query = `
      SELECT * FROM notificaciones 
      WHERE id_usuario = $1 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    const result = await pool.query(query, [userId]);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Marcar una notificación como leída
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const query = `
      UPDATE notificaciones 
      SET leida = true 
      WHERE id_notificacion = $1 AND id_usuario = $2
      RETURNING *
    `;
    const result = await pool.query(query, [id, userId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Notificación no encontrada o no autorizada" });
    }
    
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error actualizando notificación:", error);
    res.status(500).json({ success: false, error: "Error al actualizar notificación" });
  }
};