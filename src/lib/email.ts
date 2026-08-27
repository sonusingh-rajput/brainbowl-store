import nodemailer from 'nodemailer';

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

  // Always log OTP to server console for instant debugging & fallback
  console.log(`\n========================================`);
  console.log(`📩 [OTP DISPATCH] Type: ${type} | Recipient: ${to}`);
  console.log(`🔑 [VERIFICATION CODE]: >>> ${otp} <<<`);
  console.log(`========================================\n`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ [SMTP WARNING] SMTP_USER or SMTP_PASS not set. OTP printed in server console.');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
    });

    await transporter.sendMail({
      from: `"BrainBowl Store" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ [SMTP SUCCESS] Email delivered to ${to}`);
  } catch (err: any) {
    console.error(`❌ [SMTP ERROR] Failed to send email via SMTP:`, err.message || err);
    // Do not re-throw error so OTP verification still works in development/fallback mode
  }
}