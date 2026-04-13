const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
    
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

module.exports = transporter;