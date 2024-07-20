const nodemailer = require("nodemailer");
const AUTH_EMAIL = process.env.AUTH_EMAIL;
const AUTH_PASS = process.env.AUTH_PASS;
function generateRandomPassword(length = 8) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}


async function sendEmail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: AUTH_EMAIL, 
      pass: AUTH_PASS,
    },
  });

  let mailOptions = {
    from: `Timiza Logistics <${AUTH_EMAIL}>`,
    to: to,
    subject: subject,
    html: text,
  };

  await transporter.sendMail(mailOptions);
}


module.exports = {generateRandomPassword, sendEmail}
