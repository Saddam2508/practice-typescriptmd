const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const logger = require("../controllers/loggerController");
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html, // HTML body
    };
    const info = await transporter.sendMail(mailOptions);
    logger.log("info", "Message sent: %s", info.response);
  } catch (error) {
    logger.log("error", "Error occured while sending email: ", error);
    throw error;
  }
};

module.exports = emailWithNodeMailer;
