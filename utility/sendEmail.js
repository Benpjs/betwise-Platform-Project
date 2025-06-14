const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Betwise Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: subject,
    html: message,
  });

  console.log("Email sent to", email);
};

module.exports = sendEmail;