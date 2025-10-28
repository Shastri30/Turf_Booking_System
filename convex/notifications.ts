"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";
import twilio from "twilio";

// Email notification action
export const sendBookingConfirmationEmail = action({
  args: {
    to: v.string(),
    playerName: v.string(),
    turfName: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    totalPrice: v.number(),
    bookingId: v.string(),
  },
  handler: async (ctx, args) => {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: args.to,
      subject: `Booking Confirmation - ${args.turfName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
            <h1>GoTurf.com</h1>
            <h2>Booking Confirmed!</h2>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h3>Dear ${args.playerName},</h3>
            <p>Your turf booking has been confirmed. Here are the details:</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4>Booking Details:</h4>
              <p><strong>Turf:</strong> ${args.turfName}</p>
              <p><strong>Date:</strong> ${new Date(args.date).toLocaleDateString('en-IN')}</p>
              <p><strong>Time:</strong> ${args.startTime} - ${args.endTime}</p>
              <p><strong>Total Amount:</strong> ₹${args.totalPrice}</p>
              <p><strong>Booking ID:</strong> ${args.bookingId}</p>
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

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: (error as Error).message };
    }
  },
});

// SMS notification action
export const sendBookingConfirmationSMS = action({
  args: {
    to: v.string(),
    playerName: v.string(),
    turfName: v.string(),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    bookingId: v.string(),
  },
  handler: async (ctx, args) => {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = `Hi ${args.playerName}! Your GoTurf booking is confirmed.
Turf: ${args.turfName}
Date: ${new Date(args.date).toLocaleDateString('en-IN')}
Time: ${args.startTime}-${args.endTime}
Booking ID: ${args.bookingId}
Contact: +91 98192 36329`;

    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${args.to}`,
      });
      return { success: true };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: (error as Error).message };
    }
  },
});
