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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body; 

    const usuario = await userRepository.getUserByEmail(email);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.createResetToken(usuario.id_usuario, token, expiracion);

    // Intentamos enviar el correo pero NO dejamos que el cliente espere eternamente
    try {
      await sendResetEmail(email, token);
      return res.status(200).json({ 
        success: true, 
        message: "Código enviado correctamente." 
      });
    } catch (mailError) {
      // Si el correo falla, igual le avisamos a la App para que no se cuelgue
      console.log("Fallo envío de mail, pero token creado:", token);
      return res.status(200).json({ 
        success: true, 
        message: "Proceso iniciado, revise su bandeja de entrada.",
        debugToken: token // Enviamos el token solo por si quieres probar sin abrir el mail
      });
    }

  } catch (error) {
    console.error("Error en controlador:", error.message);
    return res.status(500).json({ message: "Error interno" });
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
