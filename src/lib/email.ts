import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string, type: 'REGISTER' | 'FORGOT_PASSWORD') {
  const subject = type === 'REGISTER' 
    ? 'BrainBowl — Verify Your Account' 
    : 'BrainBowl — Password Reset Code';

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 500px;">
      <h2 style="color: #22c55e;">BrainBowl Superfood</h2>
      <p style="font-size: 14px; color: #cccccc;">Your 6-digit verification code for ${type === 'REGISTER' ? 'registration' : 'password reset'} is:</p>
      <div style="background-color: #141414; border: 1px solid #262626; border-radius: 8px; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #22c55e; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #888888;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"BrainBowl Store" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}