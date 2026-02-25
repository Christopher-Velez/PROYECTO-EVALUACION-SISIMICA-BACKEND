import * as utils from "../../utils.js";
import authService from "../service/authService.js";
import userRepository from "../repositories/userRepository.js";
import crypto from "crypto";
import { sendResetEmail } from "../service/emailService.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register({ ...req.body }, { ...req.file });
    return res.status(200).json(user);
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    return res
      .status(200)
      .json({ success: true, token, userId: user.id_usuario });
  } catch (error) {
    utils.ErrorManager(error, res);
  }
};

const forgotPassword = async (req, res) => { 
  try {
    // 1. Extraemos solo el string del email del body
    const { email } = req.body; 

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    // 2. Buscamos al usuario usando el string extraído
    const usuario = await userRepository.getUserByEmail(email);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 3. Generamos token y expiración
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.createResetToken(
      usuario.id_usuario,
      token,
      expiracion
    );

    // 4. Enviamos el correo (con manejo de error interno para no colgar la respuesta)
    try {
      await sendResetEmail(email, token);
      // Respondemos al cliente inmediatamente después del envío exitoso
      return res.status(200).json({ message: "Código enviado correctamente" });
    } catch (error) {
      console.error("Error en el servicio de correo:", error.message);
      return res.status(500).json({ message: "Error al enviar el correo, pero el token fue generado." });
    }

  } catch (error) {
    // Aquí atrapamos cualquier otro error (como el circular si volviera a ocurrir)
    console.error("Error crítico en forgotPassword:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.json({ message: "Contraseña actualizada" });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


const authController = {
  login,
  register,
  forgotPassword,
  resetPassword
};
export default authController;
