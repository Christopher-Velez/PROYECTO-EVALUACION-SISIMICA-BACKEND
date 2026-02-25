// emailService.js
import { Resend } from 'resend';

// Esta API KEY debe estar en las variables de entorno de Render
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (to, token) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SismosApp <onboarding@resend.dev>', // Resend permite este remitente para pruebas
      to: [to],
      subject: 'Recuperación de Contraseña',
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>Código de Verificación</h2>
          <p>Tu código de recuperación es:</p>
          <h1 style="color: #6200EE; font-size: 32px; letter-spacing: 5px;">${token}</h1>
          <p>Válido por 15 minutos.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error de la API de Resend:", error);
      throw new Error(error.message);
    }

    console.log("Email enviado exitosamente:", data.id);
    return { success: true };
  } catch (error) {
    console.error("Error crítico en sendResetEmail:", error.message);
    throw new Error("No se pudo enviar el correo.");
  }
};