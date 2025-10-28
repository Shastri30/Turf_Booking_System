import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    amount: v.number(),
    currency: v.string(),
    receipt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create payment order");
    }

    // In a real implementation, you would call Razorpay API here
    // For demo purposes, we'll return a mock order
    const order = {
      id: `order_${Date.now()}`,
      entity: "order",
      amount: args.amount * 100, // Razorpay expects amount in paise
      amount_paid: 0,
      amount_due: args.amount * 100,
      currency: args.currency,
      receipt: args.receipt,
      status: "created",
      created_at: Math.floor(Date.now() / 1000),
    };

    // Store order in database for verification
    await ctx.db.insert("paymentOrders", {
      orderId: order.id,
      userId,
      amount: args.amount,
      currency: args.currency,
      receipt: args.receipt,
      status: "created",
    });

    return order;
  },
});

export const verifyPayment = mutation({
  args: {
    razorpay_order_id: v.string(),
    razorpay_payment_id: v.string(),
    razorpay_signature: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to verify payment");
    }

    // In a real implementation, you would verify the signature using Razorpay webhook secret
    // For demo purposes, we'll assume the payment is valid
    
    // Update payment order status
    const order = await ctx.db
      .query("paymentOrders")
      .filter((q) => q.eq(q.field("orderId"), args.razorpay_order_id))
      .first();

    if (!order) {
      throw new Error("Payment order not found");
    }

    await ctx.db.patch(order._id, {
      status: "paid",
      paymentId: args.razorpay_payment_id,
      signature: args.razorpay_signature,
    });

    return { success: true };
  },
});
