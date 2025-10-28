import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("turfs").collect();
  },
});

export const getById = query({
  args: { id: v.id("turfs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getMyTurfs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("turfs")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    pricePerPerson: v.optional(v.number()),
    category: v.optional(v.union(
      v.literal("football"),
      v.literal("cricket"),
      v.literal("hockey"),
      v.literal("badminton"),
      v.literal("basketball"),
      v.literal("multipurpose")
    )),
    maxPlayers: v.optional(v.number()),
    amenities: v.array(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to create turf");
    }

    return await ctx.db.insert("turfs", {
      ...args,
      ownerId: userId,
      isActive: true,
      averageRating: 0,
      totalReviews: 0,
      pricePerPerson: args.pricePerPerson || 50,
      category: args.category || "football",
      maxPlayers: args.maxPlayers || 22,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("turfs"),
    name: v.string(),
    description: v.string(),
    location: v.string(),
    pricePerHour: v.number(),
    pricePerPerson: v.optional(v.number()),
    category: v.optional(v.union(
      v.literal("football"),
      v.literal("cricket"),
      v.literal("hockey"),
      v.literal("badminton"),
      v.literal("basketball"),
      v.literal("multipurpose")
    )),
    maxPlayers: v.optional(v.number()),
    amenities: v.array(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const turf = await ctx.db.get(args.id);
    if (!turf) {
      throw new Error("Turf not found");
    }

    if (turf.ownerId !== userId) {
      throw new Error("Unauthorized to update this turf");
    }

    const { id, ...updateData } = args;
    await ctx.db.patch(id, updateData);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("turfs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const turf = await ctx.db.get(args.id);
    if (!turf) {
      throw new Error("Turf not found");
    }

    if (turf.ownerId !== userId) {
      throw new Error("Unauthorized to update this turf");
    }

    await ctx.db.patch(args.id, { isActive: !turf.isActive });
  },
});
