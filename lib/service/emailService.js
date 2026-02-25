import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // La contraseña de aplicación de 16 caracteres
  },
  tls: {
    // Esto evita errores de certificado en servidores como Render
    rejectUnauthorized: false 
  }
});

export const sendResetEmail = async (to, token) => {
  try {
    await transporter.sendMail({
      from: `"SismosApp" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: sans-serif; text-align: center;">
          <h2>Recuperar contraseña</h2>
          <p>Tu código de recuperación es:</p>
          <h1 style="color: #6200EE; letter-spacing: 5px;">${token}</h1>
          <p>Este código expira en 15 minutos.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error enviando email:", error);
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
};