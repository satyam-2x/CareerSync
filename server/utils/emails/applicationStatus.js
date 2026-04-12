// Generate email content based on application status
const applicationStatusTemplate = (name, jobTitle, status) => {
  let message = "";
  let subject = "Application Update";

  if (status === "accepted") {
    subject = "You're Shortlisted! 🎉";
    message = `
      <p>Great news! We’re excited to inform you that you have been <b>shortlisted</b> for the position of <b>${jobTitle}</b>.</p>
      <p>Our team will reach out to you soon with the next steps.</p>
    `;
  } else if (status === "rejected") {
    subject = "Update on Your Application";
    message = `
      <p>Thank you for your interest in the position of <b>${jobTitle}</b>.</p>
      <p>After careful consideration, we regret to inform you that you were <b>not selected</b> for this role.</p>
      <p>We truly appreciate the time and effort you put into your application and encourage you to apply for future opportunities with us.</p>
    `;
  } else {
    // Default fallback (for safety)
    message = `
      <p>Your application status for <b>${jobTitle}</b> has been updated.</p>
    `;
  }

  return {
    subject,
    html: `
      <p>Hello ${name},</p>
      ${message}
      <br/>
      <p>Best regards,</p>
      <p><b>CareerSync Team</b></p>
    `
  };
};

module.exports = applicationStatusTemplate;