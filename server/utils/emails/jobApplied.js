const jobAppliedTemplate = (name, jobTitle) => {
  return {
    subject: "Application Successful",
    html: `
      <div>
        <p>Hello ${name || "User"},</p>

        <p>You have successfully applied for <b>${jobTitle}</b>.</p>
        <p>We will notify you about further updates.</p>

        <br/>
        <p>Best regards,</p>
        <p><b>CareerSync Team</b></p>
      </div>
    `
  };
};

module.exports = jobAppliedTemplate;