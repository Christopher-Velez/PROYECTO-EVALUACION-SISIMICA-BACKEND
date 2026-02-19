import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (to, token) => {
  await transporter.sendMail({
    from: `"SismosApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperación de contraseña",
    html: `
      <h2>Recuperar contraseña</h2>
      <p>Tu código de recuperación es:</p>
      <h1>${token}</h1>
      <p>Este código expira en 15 minutos.</p>
    `,
  });
};
