import { createTransport } from 'nodemailer'

export const mailTransporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.HOST_PASS
  }
});



export const sendEmail = async (to, subject, html) => {
  try {
    const send = await mailTransporter.sendMail({
      from: `"SkillSprout" <${process.env.HOST_EMAIL}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: message
    });
    return send;

  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};



// export const registerUserMailTemplate = `<div>
//       <h2>Password Reset Request</h2>
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetUrl}">Reset Password</a>
//       <p>This link expires in 20 minutes.</p>
//     </div>`