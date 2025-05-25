import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";
import { Id } from "./_generated/dataModel";

export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    try {
      console.log("toggleBookmark called with postId:", args.postId);

      const currentUser = await getAuthenticatedUser(ctx);

      const existing = await ctx.db
        .query("bookmarks")
        .withIndex("by_user_and_post", (q) =>
          q.eq("userId", currentUser._id).eq("postId", args.postId)
        )
        .first();

      console.log("Existing bookmark:", existing);

      if (existing) {
        console.log("Removing bookmark");
        await ctx.db.delete(existing._id);
        return false; // Bookmark removed
      } else {
        console.log("Adding bookmark");
        await ctx.db.insert("bookmarks", {
          userId: currentUser._id,
          postId: args.postId,
        });
        return true; // Bookmark added
      }
    } catch (error) {
      console.error("Error in toggleBookmark:", error);
      throw new Error("Failed to toggle bookmark");
    }
  },
});

export const getBookmarkedPosts = query ({
    handler: async (ctx) => {
      const currentUser = await getAuthenticatedUser(ctx);

      const bookmarks = await ctx.db.query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .collect();

      const bookmarkWithInfo = await Promise.all(
        bookmarks.map(async (bookmark) =>{
            const post = await ctx.db.get(bookmark.postId);
            return post 
        })
      );
      return bookmarkWithInfo;
    }
})