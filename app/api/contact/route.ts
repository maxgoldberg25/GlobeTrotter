import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, to } = await request.json();
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For security, ensure the destination email is always welliberg@gmail.com
    const recipientEmail = 'welliberg@gmail.com';
    
    // Set up email transporter
    // Note: In production, you would use environment variables for these credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Email content
    const mailOptions = {
      from: email,
      to: recipientEmail,
      subject: `GlobeTrotter Contact: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #3b82f6;">New Message from GlobeTrotter Contact Form</h2>
  <p><strong>From:</strong> ${name} (${email})</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
    <h3 style="margin-top: 0; color: #4b5563;">Message:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
    This email was sent from the GlobeTrotter contact form.
  </p>
</div>
      `,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to send email' },
      { status: 500 }
    );
  }
} 