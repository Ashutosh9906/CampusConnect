import nodemailer from "nodemailer";

async function sendEmail(recipientEmail, { subject, html }) {
  try {
    // ✅ create transporter HERE (after env is loaded)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: recipientEmail,
      subject,
      html,
    });

    console.log("✅ Email Sent:", info.response);
    return true;

  } catch (error) {
    console.log("❌ Email Error:", error.message);
    return false;
  }
}

// export { sendEmail };

export {
  sendEmail
}