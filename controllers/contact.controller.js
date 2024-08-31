const express = require('express');
const router = express.Router();
const transporter = require('../config/emailConfig');

const createEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: email,
    to: process.env.CONTACT_EMAIL, 
    subject: `Contact Us Message from ${name}`,
    text: message,
    replyTo: email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.status(200).json({ message: 'Message sent successfully' });
  });
}

module.exports = createEmail;
