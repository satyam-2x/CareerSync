// Email template for account verification OTP
const verifyEmailTemplate = (otp) => {
  return `
    <p><b>Welcome to CareerSync 🚀</b></p>

    <p>Your OTP for account verification is:</p>
    <h2>${otp}</h2>

    <p>This OTP is valid for 5 minutes.</p>

    <br/>
    <p>Best regards,</p>
    <p><b>CareerSync Team</b></p>
  `;
};

module.exports = verifyEmailTemplate;