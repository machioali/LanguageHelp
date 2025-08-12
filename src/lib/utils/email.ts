import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@languagehelp.com';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Create transporter
const transporter = nodemailer.createTransporter(EMAIL_CONFIG);

interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  tempPassword: string;
  loginToken: string;
}

interface ApplicationStatusEmailData {
  firstName: string;
  lastName: string;
  email: string;
  status: 'APPROVED' | 'REJECTED';
  notes?: string;
}

/**
 * Send welcome email to newly approved interpreter
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const { firstName, lastName, email, tempPassword, loginToken } = data;
  
  const loginUrl = `${APP_URL}/auth/interpreter-signin?token=${loginToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to LanguageHelp</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌟 Welcome to LanguageHelp!</h1>
          <p>Your interpreter account has been approved</p>
        </div>
        
        <div class="content">
          <p>Dear ${firstName} ${lastName},</p>
          
          <p>Congratulations! Your interpreter application has been approved, and your account is now active. We're excited to have you join our team of professional interpreters.</p>
          
          <div class="credentials">
            <h3>🔑 Your Login Credentials</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> <code style="background: #f1f1f1; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${tempPassword}</code></p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This is a temporary password. You'll be required to change it when you first sign in. This link expires in 48 hours.
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" class="button">Sign In to Your Dashboard</a>
          </div>
          
          <h3>🚀 What's Next?</h3>
          <ul>
            <li>Sign in to your interpreter dashboard</li>
            <li>Complete your profile setup</li>
            <li>Review your language and specialization settings</li>
            <li>Set your availability preferences</li>
            <li>Start accepting interpretation requests</li>
          </ul>
          
          <h3>📞 Need Help?</h3>
          <p>If you have any questions or need assistance getting started, our support team is here to help:</p>
          <ul>
            <li>Email: <a href="mailto:support@languagehelp.com">support@languagehelp.com</a></li>
            <li>Phone: 1-800-LANGUAGE (1-800-526-4824)</li>
            <li>Live Chat: Available 24/7 in your dashboard</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Thank you for joining LanguageHelp - Breaking Language Barriers, One Conversation at a Time</p>
          <p>© ${new Date().getFullYear()} LanguageHelp. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
    Welcome to LanguageHelp!
    
    Dear ${firstName} ${lastName},
    
    Congratulations! Your interpreter application has been approved.
    
    Login Credentials:
    Email: ${email}
    Temporary Password: ${tempPassword}
    
    Sign in here: ${loginUrl}
    
    IMPORTANT: This is a temporary password. You'll need to change it when you first sign in.
    This link expires in 48 hours.
    
    Need help? Contact us at support@languagehelp.com
    
    Thank you for joining LanguageHelp!
  `;

  try {
    await transporter.sendMail({
      from: `"LanguageHelp Team" <${FROM_EMAIL}>`,
      to: email,
      subject: '🎉 Welcome to LanguageHelp - Your Interpreter Account is Ready!',
      text: textContent,
      html: htmlContent,
    });
    
    console.log(`Welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}

/**
 * Send application status update email
 */
export async function sendApplicationStatusEmail(data: ApplicationStatusEmailData): Promise<void> {
  const { firstName, lastName, email, status, notes } = data;
  
  const isApproved = status === 'APPROVED';
  const subject = isApproved 
    ? '✅ Your LanguageHelp Interpreter Application - Approved!' 
    : '📧 Update on Your LanguageHelp Interpreter Application';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${isApproved ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#6c757d'}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .status { background: ${isApproved ? '#d4edda' : '#f8d7da'}; color: ${isApproved ? '#155724' : '#721c24'}; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${isApproved ? '🎉' : '📧'} Application Update</h1>
        </div>
        
        <div class="content">
          <p>Dear ${firstName} ${lastName},</p>
          
          <div class="status">
            <h3>Your application status: <strong>${status}</strong></h3>
          </div>
          
          ${isApproved 
            ? '<p>We are pleased to inform you that your interpreter application has been approved! You will receive a separate email with your login credentials shortly.</p>'
            : `<p>Thank you for your interest in joining LanguageHelp as an interpreter. After careful review, we have decided not to move forward with your application at this time.</p>
               ${notes ? `<p><strong>Additional feedback:</strong> ${notes}</p>` : ''}`
          }
          
          ${!isApproved ? '<p>We encourage you to reapply in the future if you gain additional qualifications or experience.</p>' : ''}
          
          <p>If you have any questions, please don't hesitate to contact us at support@languagehelp.com</p>
          
          <p>Thank you for your interest in LanguageHelp.</p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"LanguageHelp Team" <${FROM_EMAIL}>`,
      to: email,
      subject,
      html: htmlContent,
    });
    
    console.log(`Application status email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send application status email:', error);
    throw new Error('Failed to send application status email');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<void> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset</h1>
        </div>
        
        <div class="content">
          <p>Dear ${firstName},</p>
          
          <p>We received a request to reset your LanguageHelp interpreter account password.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Your Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link expires in 1 hour. If you didn't request this reset, please ignore this email.
          </div>
          
          <p>If you have any questions, contact us at support@languagehelp.com</p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"LanguageHelp Team" <${FROM_EMAIL}>`,
      to: email,
      subject: '🔐 Reset Your LanguageHelp Password',
      html: htmlContent,
    });
    
    console.log(`Password reset email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
