import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addToFavorites = mutation({
  args: { turfId: v.id("turfs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Check if already in favorites
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_turf", (q) => 
        q.eq("userId", userId).eq("turfId", args.turfId)
      )
      .first();

    if (existing) {
      throw new Error("Already in favorites");
    }

    await ctx.db.insert("favorites", {
      userId,
      turfId: args.turfId,
    });
  },
});

export const removeFromFavorites = mutation({
  args: { turfId: v.id("turfs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_turf", (q) => 
        q.eq("userId", userId).eq("turfId", args.turfId)
      )
      .first();

    if (favorite) {
      await ctx.db.delete(favorite._id);
    }
  },
});

export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return Promise.all(
      favorites.map(async (favorite) => {
        const turf = await ctx.db.get(favorite.turfId);
        return turf;
      })
    );
  },
});

export const isFavorite = query({
  args: { turfId: v.id("turfs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_turf", (q) => 
        q.eq("userId", userId).eq("turfId", args.turfId)
      )
      .first();

    return !!favorite;
  },
});
