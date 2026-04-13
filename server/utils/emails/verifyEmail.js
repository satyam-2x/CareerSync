const verifyEmailTemplate = (otp) => {
  return {
    subject: "Verify Your Account",
    html: `
      <div>
        <p><b>Welcome to CareerSync 🚀</b></p>

        <p>Your OTP for account verification is:</p>
        <h2>${otp}</h2>

        <p>This OTP is valid for 5 minutes.</p>

        <br/>
        <p>Best regards,</p>
        <p><b>CareerSync Team</b></p>
      </div>
    `
  };
};

module.exports = verifyEmailTemplate;