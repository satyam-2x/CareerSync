// Email template for successful job application
const jobAppliedTemplate = (name, jobTitle) => {
  return {
    subject: "Application successful",
    html: `
      <p>Hello ${name},</p>

      <p>You have successfully applied for <b>${jobTitle}</b>.</p>
      <p>We will notify you about further updates.</p>

      <br/>
      <p>Best regards,</p>
      <p><b>CareerSync Team</b></p>
    `
  };
};

module.exports = jobAppliedTemplate;