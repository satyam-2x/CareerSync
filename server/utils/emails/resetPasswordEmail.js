const resetPasswordTemplate = (otp) => {
  return {
    subject: "Password Reset OTP",
    html: `
      <div>
        <p><b>Password Reset 🔐</b></p>

        <p>Your OTP to reset your password is:</p>
        <h2>${otp}</h2>

        <p>This OTP is valid for a limited time.</p>
        <p>If you did not request this, you can ignore this email.</p>

        <br/>
        <p>Best regards,</p>
        <p><b>CareerSync Team</b></p>
      </div>
    `
  };
};

module.exports = resetPasswordTemplate;