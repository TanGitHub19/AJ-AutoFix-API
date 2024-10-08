const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  },
});

const sendVerificationEmail = (to, verificationToken) => {
  const verificationLink = `https://aj-auto-fix.vercel.app/api/auth/verify-email?token=${verificationToken}`;
  console.log("Verification Email Link:", verificationLink); 

  const mailOptions = {
    from: '"A&J AutoFix" <email@gmail.com>',
    to,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`,
  };

  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent: ' + info.response);
    })
    .catch(error => {
      console.error('Error sending email:', error);
      throw new Error('Email could not be sent');
    });
};


const sendOtpEmail = async (email, otp) => {
    const emailContent = `
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
    `;
    await transporter.sendMail({
      from: '"A&J AutoFix" <email@gmail.com>',
      to: email,
      subject: "Password Reset OTP",
      html: emailContent,
    });
  };

module.exports = { sendVerificationEmail, sendOtpEmail };
