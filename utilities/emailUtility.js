import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendEmail(recipientEmail, { subject, html }) {

  try {

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: process.env.USER_EMAIL,
      name: "CampusConnect"
    };

    sendSmtpEmail.to = [
      {
        email: recipientEmail
      }
    ];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email Sent:", response);

    return true;

  } catch(error) {

    console.log("❌ Email Error:", error);

    return false;
  }
}

export { sendEmail };