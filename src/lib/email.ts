import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  })
}

// Email templates
const getPasswordResetEmailHtml = (resetUrl: string, userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your WattWise Password</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px; text-align: center; }
        .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px; }
        .title { color: #333333; font-size: 24px; margin-bottom: 20px; }
        .message { color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .button:hover { opacity: 0.9; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .footer-text { color: #6c757d; font-size: 14px; margin: 0; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; color: #856404; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">⚡ WattWise</h1>
        </div>
        <div class="content">
          <h2 class="title">Reset Your Password</h2>
          <p class="message">Hi ${userName},</p>
          <p class="message">We received a request to reset your WattWise account password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </div>
          
          <div class="warning">
            <strong>⏰ This link expires in 15 minutes</strong><br>
            For security reasons, this password reset link will only work for the next 15 minutes.
          </div>
          
          <p class="message">If you didn't request this password reset, you can safely ignore this email. Your account will remain secure.</p>
          
          <p class="message">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p class="footer-text">Best regards,<br><strong>The WattWise Team</strong></p>
          <p class="footer-text" style="margin-top: 15px;">Empowering Nigerians with smart solar solutions</p>
        </div>
      </div>
    </body>
    </html>
  `
}

const getPasswordResetEmailText = (resetUrl: string, userName: string) => {
  return `
Hi ${userName},

We received a request to reset your WattWise account password.

Click this link to reset your password:
${resetUrl}

This link expires in 15 minutes for security reasons.

If you didn't request this password reset, you can safely ignore this email.

Best regards,
The WattWise Team
Empowering Nigerians with smart solar solutions
  `.trim()
}

// Send password reset email
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  userName: string
) {
  try {
    const transporter = createTransporter()
    
    // Construct reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`
    
    const mailOptions = {
      from: `"WattWise" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Reset Your WattWise Password 🔐',
      text: getPasswordResetEmailText(resetUrl, userName),
      html: getPasswordResetEmailHtml(resetUrl, userName),
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', result.messageId)
    
    return {
      success: true,
      messageId: result.messageId,
    }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email configuration is valid')
    return { success: true }
  } catch (error) {
    console.error('Email configuration failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}