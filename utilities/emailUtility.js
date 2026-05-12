import nodemailer from "nodemailer";

async function sendEmail(recipientEmail, { subject, html }) {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASS,
      },

      family: 4
    });

    await transporter.verify();
    console.log("SMTP Ready");

    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: recipientEmail,
      subject,
      html,
    });

    console.log("✅ Email Sent:", info.response);
    return true;

  } catch (error) {
    console.log("❌ Email Error:", error);
    return false;
  }
}

export { sendEmail };