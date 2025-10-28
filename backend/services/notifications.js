const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Email service
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// SMS service
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send booking confirmation email
const sendBookingConfirmationEmail = async ({
  to,
  playerName,
  turfName,
  date,
  startTime,
  endTime,
  totalPrice,
  bookingId
}) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: `Booking Confirmation - ${turfName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
            <h1>GoTurf.com</h1>
            <h2>Booking Confirmed!</h2>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Dear ${playerName},</h3>
            <p>Your turf booking has been confirmed. Here are the details:</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>Booking Details:</h4>
              <p><strong>Turf:</strong> ${turfName}</p>
              <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN')}</p>
              <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
              <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
            </div>
            
            <p>Please arrive 15 minutes before your scheduled time and bring a valid ID.</p>
            <p>For any queries, contact us at +91 98192 36329 or +91 80101 97163</p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p>Thank you for choosing GoTurf.com!</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send booking confirmation SMS
const sendBookingConfirmationSMS = async ({
  to,
  playerName,
  turfName,
  date,
  startTime,
  endTime,
  bookingId
}) => {
  try {
    const message = `Hi ${playerName}! Your GoTurf booking is confirmed.
Turf: ${turfName}
Date: ${new Date(date).toLocaleDateString('en-IN')}
Time: ${startTime}-${endTime}
Booking ID: ${bookingId}
Contact: +91 98192 36329`;

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${to}`,
    });

    return { success: true };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingConfirmationSMS
};
