const applicationStatusTemplate = (name, jobTitle, status) => {
  let subject = "Application Update";
  let message = "";

  if (status === "accepted") {
    subject = "You're Shortlisted! 🎉";
    message = `
      <p>Great news! You have been <b>shortlisted</b> for <b>${jobTitle}</b>.</p>
      <p>We will contact you soon with next steps.</p>
    `;
  } else if (status === "rejected") {
    subject = "Update on Your Application";
    message = `
      <p>Thank you for applying for <b>${jobTitle}</b>.</p>
      <p>We regret to inform you that you were <b>not selected</b>.</p>
      <p>Please apply again in future.</p>
    `;
  } else {
    message = `
      <p>Your application status for <b>${jobTitle}</b> has been updated.</p>
    `;
  }

  return {
    subject,
    html: `
      <div>
        <p>Hello ${name || "User"},</p>
        ${message}
        <br/>
        <p>Best regards,</p>
        <p><b>CareerSync Team</b></p>
      </div>
    `
  };
};

module.exports = applicationStatusTemplate;