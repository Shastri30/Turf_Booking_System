import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  turfs: defineTable({
    name: v.string(),
    description: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    pricePerPerson: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    amenities: v.array(v.string()),
    rules: v.optional(v.array(v.string())),
    ownerId: v.id("users"),
    isActive: v.boolean(),
    category: v.optional(v.union(
      v.literal("football"),
      v.literal("cricket"),
      v.literal("hockey"),
      v.literal("badminton"),
      v.literal("basketball"),
      v.literal("multipurpose")
    )),
    maxPlayers: v.optional(v.number()),
    minPlayers: v.optional(v.number()),
    averageRating: v.optional(v.number()),
    totalReviews: v.optional(v.number()),
    isTopRated: v.optional(v.boolean()),
    popularityScore: v.optional(v.number()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_category", ["category"])
    .index("by_price", ["pricePerHour"])
    .index("by_rating", ["averageRating"]),

  bookings: defineTable({
    turfId: v.id("turfs"),
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD format
    startTime: v.string(), // HH:MM format
    endTime: v.string(), // HH:MM format
    totalPrice: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("cancelled")),
    playerName: v.string(),
    playerPhone: v.string(),
    playerAge: v.optional(v.number()),
    playerGender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    playerAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    paymentId: v.optional(v.string()),
    paymentMethod: v.optional(v.union(v.literal("online"), v.literal("cash"))),
    bookingId: v.optional(v.string()),
    emailSent: v.optional(v.boolean()),
    smsSent: v.optional(v.boolean()),
  })
    .index("by_turf", ["turfId"])
    .index("by_user", ["userId"])
    .index("by_date", ["date"])
    .index("by_turf_and_date", ["turfId", "date"])
    .index("by_booking_id", ["bookingId"]),

  reviews: defineTable({
    turfId: v.id("turfs"),
    userId: v.id("users"),
    bookingId: v.id("bookings"),
    rating: v.number(), // 1-5 stars
    comment: v.string(),
    playerName: v.string(),
  })
    .index("by_turf", ["turfId"])
    .index("by_user", ["userId"])
    .index("by_booking", ["bookingId"]),

  timeSlots: defineTable({
    turfId: v.id("turfs"),
    date: v.string(), // YYYY-MM-DD format
    startTime: v.string(), // HH:MM format
    endTime: v.string(), // HH:MM format
    isAvailable: v.boolean(),
    price: v.number(),
  })
    .index("by_turf_and_date", ["turfId", "date"])
    .index("by_turf", ["turfId"]),

  paymentOrders: defineTable({
    orderId: v.string(),
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    receipt: v.string(),
    status: v.union(v.literal("created"), v.literal("paid"), v.literal("failed")),
    paymentId: v.optional(v.string()),
    signature: v.optional(v.string()),
  })
    .index("by_order_id", ["orderId"])
    .index("by_user", ["userId"]),

  favorites: defineTable({
    userId: v.id("users"),
    turfId: v.id("turfs"),
  })
    .index("by_user", ["userId"])
    .index("by_turf", ["turfId"])
    .index("by_user_and_turf", ["userId", "turfId"]),

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    isAdmin: v.optional(v.boolean()),
    isAnonymous: v.optional(v.boolean()),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
