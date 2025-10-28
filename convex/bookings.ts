import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    turfId: v.id("turfs"),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    playerName: v.string(),
    playerPhone: v.string(),
    playerAge: v.optional(v.number()),
    playerGender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    playerAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    paymentMethod: v.optional(v.union(v.literal("online"), v.literal("cash"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to book");
    }

    // Check if the time slot is available
    const existingBooking = await ctx.db
      .query("bookings")
      .withIndex("by_turf_and_date", (q) => 
        q.eq("turfId", args.turfId).eq("date", args.date)
      )
      .filter((q) => 
        q.and(
          q.neq(q.field("status"), "cancelled"),
          q.or(
            q.and(
              q.lte(q.field("startTime"), args.startTime),
              q.gt(q.field("endTime"), args.startTime)
            ),
            q.and(
              q.lt(q.field("startTime"), args.endTime),
              q.gte(q.field("endTime"), args.endTime)
            ),
            q.and(
              q.gte(q.field("startTime"), args.startTime),
              q.lte(q.field("endTime"), args.endTime)
            )
          )
        )
      )
      .first();

    if (existingBooking) {
      throw new Error("Time slot is already booked");
    }

    // Get turf details for pricing
    const turf = await ctx.db.get(args.turfId);
    if (!turf) {
      throw new Error("Turf not found");
    }

    // Calculate duration and total price
    const startHour = parseInt(args.startTime.split(':')[0]);
    const endHour = parseInt(args.endTime.split(':')[0]);
    const duration = endHour - startHour;
    const totalPrice = duration * turf.pricePerHour;

    // Generate unique booking ID
    const bookingId = `GT${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const bookingDocId = await ctx.db.insert("bookings", {
      ...args,
      userId,
      totalPrice,
      status: "confirmed",
      paymentMethod: args.paymentMethod || "online",
      bookingId,
      emailSent: false,
      smsSent: false,
    });

    // Schedule email and SMS notifications
    // TODO: Add notification scheduling after deployment
    // await ctx.scheduler.runAfter(0, internal.notifications.sendBookingConfirmationEmail, {
    //   to: args.playerPhone + "@gmail.com",
    //   playerName: args.playerName,
    //   turfName: turf.name,
    //   date: args.date,
    //   startTime: args.startTime,
    //   endTime: args.endTime,
    //   totalPrice,
    //   bookingId,
    // });

    // await ctx.scheduler.runAfter(0, internal.notifications.sendBookingConfirmationSMS, {
    //   to: args.playerPhone,
    //   playerName: args.playerName,
    //   turfName: turf.name,
    //   date: args.date,
    //   startTime: args.startTime,
    //   endTime: args.endTime,
    //   bookingId,
    // });

    return { bookingId: bookingDocId, confirmationId: bookingId };
  },
});

export const getByTurf = query({
  args: { turfId: v.id("turfs"), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_turf_and_date", (q) => 
        q.eq("turfId", args.turfId).eq("date", args.date)
      )
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();
  },
});

export const getMyBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return Promise.all(
      bookings.map(async (booking) => {
        const turf = await ctx.db.get(booking.turfId);
        return {
          ...booking,
          turfName: turf?.name || "Unknown Turf",
          turfLocation: turf?.location || "",
        };
      })
    );
  },
});

export const getOwnerBookings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get all turfs owned by the user
    const myTurfs = await ctx.db
      .query("turfs")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    const turfIds = myTurfs.map(turf => turf._id);
    
    // Get all bookings for these turfs
    const allBookings = [];
    for (const turfId of turfIds) {
      const bookings = await ctx.db
        .query("bookings")
        .withIndex("by_turf", (q) => q.eq("turfId", turfId))
        .collect();
      allBookings.push(...bookings);
    }

    // Sort by creation time (most recent first)
    allBookings.sort((a, b) => b._creationTime - a._creationTime);

    return Promise.all(
      allBookings.map(async (booking) => {
        const turf = await ctx.db.get(booking.turfId);
        const user = await ctx.db.get(booking.userId);
        return {
          ...booking,
          turfName: turf?.name || "Unknown Turf",
          userName: user?.name || booking.playerName,
        };
      })
    );
  },
});

export const cancel = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const booking = await ctx.db.get(args.id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Check if user owns the booking or the turf
    const turf = await ctx.db.get(booking.turfId);
    if (booking.userId !== userId && turf?.ownerId !== userId) {
      throw new Error("Unauthorized to cancel this booking");
    }

    await ctx.db.patch(args.id, { status: "cancelled" });
  },
});

export const getAvailableSlots = query({
  args: { turfId: v.id("turfs"), date: v.string() },
  handler: async (ctx, args) => {
    // Get all bookings for this turf on this date
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_turf_and_date", (q) => 
        q.eq("turfId", args.turfId).eq("date", args.date)
      )
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const isToday = args.date === now.toISOString().split('T')[0];

    // Generate available time slots (6 AM to 11 PM)
    const availableSlots = [];
    for (let hour = 6; hour < 23; hour++) {
      // Skip past hours if booking for today
      if (isToday && hour <= currentHour) {
        continue;
      }
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Check if this slot conflicts with any booking
      const isBooked = bookings.some(booking => {
        const bookingStart = parseInt(booking.startTime.split(':')[0]);
        const bookingEnd = parseInt(booking.endTime.split(':')[0]);
        return hour >= bookingStart && hour < bookingEnd;
      });

      if (!isBooked) {
        availableSlots.push({
          startTime,
          endTime,
          hour,
        });
      }
    }

    return availableSlots;
  },
});
