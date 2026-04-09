const nodemailer = require('nodemailer');

const canSendEmail = () =>
  Boolean(
    process.env.MAIL_HOST &&
      process.env.MAIL_PORT &&
      process.env.MAIL_USER &&
      process.env.MAIL_PASS
  );

const createTransporter = () =>
  nodemailer.createTransport(
    process.env.MAIL_HOST === 'smtp.gmail.com'
      ? {
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        }
      : {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT || 587),
          secure: Number(process.env.MAIL_PORT || 587) === 465,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
          }
        }
  );

const sendResetEmail = async (email, resetLink) => {
  if (!canSendEmail()) {
    console.log(`Email credentials missing. Password reset link for ${email}: ${resetLink}`);
    return;
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#0f766e;color:#fff;text-decoration:none;border-radius:6px;">
              Reset Password
            </a>
          </p>
          <p>This link expires in 1 hour.</p>
        </div>
      `
    });
  } catch (error) {
    console.log(`Email send failed for ${email}. Reset link: ${resetLink}`);
    console.log('Mailer error:', error.message);
  }
};

module.exports = { sendResetEmail, canSendEmail };
