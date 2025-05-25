import { mutation, query } from "./_generated/server"; // Added `query` import
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users"; // Adjust if your auth util is elsewhere
import { Id } from "./_generated/dataModel";

// Mutation to create a post
export const createPost = mutation({
  args: v.object({
    storageId: v.id("_storage"),
    imageUrl: v.string(),
    caption: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get the authenticated user
    const identity = await getAuthenticatedUser(ctx);

    if (!identity) {
      throw new Error("User not authenticated");
    }

    // Fetch the current user from the database
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.clerkId))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Validate the storage ID and get the image URL
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Image URL not found");
    }

    // Insert the post into the database
    await ctx.db.insert("posts", {
      userId: currentUser._id,
      storageId: args.storageId,
      imageUrl: args.imageUrl,
      caption: args.caption,
      likes: 0,
      comments: 0,
      createdAt: Date.now(),
    });

    // Increment the user's post count
    await ctx.db.patch(currentUser._id, {
      posts: (currentUser.posts || 0) + 1, // Increment the post count
    });

    console.log("✅ Post created successfully and user's post count updated");
  },
});

// Mutation to generate an upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    try {
      const uploadUrl = await ctx.storage.generateUploadUrl();
      console.log("✅ Upload URL generated:", uploadUrl);
      return uploadUrl;
    } catch (error: any) {
      console.error("❌ Error generating upload URL:", error.message, error.stack);
      throw new Error("Failed to generate upload URL");
    }
  },
});

// Query to get feed posts
export const getFeedPosts = query({
  handler: async (ctx) => {
    try {
      // Get the authenticated user
      const currentUser = await getAuthenticatedUser(ctx);
      if (!currentUser) throw new Error("User not authenticated");

      console.log("Authenticated user:", currentUser);

      // Fetch all posts
      const posts = await ctx.db.query("posts").order("desc").collect();
      if (posts.length === 0) return [];

      console.log("Fetched posts:", posts);

      // Enhance posts with user data and interaction status
      const postsWithInfo = await Promise.all(
        posts.map(async (post) => {
          const postAuthor = (await ctx.db.get(post.userId))!; // Fetch the author of the post

          // Ensure the post belongs to the current user
          if (postAuthor?._id !== currentUser._id) {
            return null; // Skip posts not authored by the current user
          }

          const like = await ctx.db
            .query("likes")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", currentUser._id).eq("postId", post._id)
            )
            .first();

          const bookmark = await ctx.db
            .query("bookmarks")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", currentUser._id).eq("postId", post._id)
            )
            .first();

          return {
            ...post,
            author: {
              _id: postAuthor?._id,
              username: postAuthor?.username, // Include the username
              image: postAuthor?.image,
            },
            isLiked: !!like,
            isBookmarked: !!bookmark,
          };
        })
      );

      // Filter out null values (posts not authored by the current user)
      return postsWithInfo.filter((post) => post !== null);
    } catch (error) {
      console.error("Error in getFeedPosts:", error);
      throw new Error("getFeedPosts failed");
    }
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    try {
      console.log("toggleLike called with postId:", args.postId);

      const currentUser = await getAuthenticatedUser(ctx);
      console.log("Authenticated user:", currentUser);

      const post = await ctx.db.get(args.postId);
      if (!post) {
        console.error("Post not found for ID:", args.postId);
        throw new Error("Post not found");
      }
      console.log("Post fetched:", post);

      const existing = await ctx.db
        .query("likes")
        .withIndex("by_user_and_post", (q) =>
          q.eq("userId", currentUser._id).eq("postId", args.postId)
        )
        .first();

      console.log("Existing like:", existing);

      if (existing) {
        console.log("Removing like");
        await ctx.db.delete(existing._id);
        await ctx.db.patch(args.postId, { likes: post.likes - 1 });
        return false;
      } else {
        console.log("Inserting like");
        await ctx.db.insert("likes", {
          userId: currentUser._id,
          postId: args.postId,
        });
        await ctx.db.patch(args.postId, { likes: post.likes + 1 });

        if ("userId" in post && currentUser._id !== post.userId) {
          console.log("Creating notification");
          await ctx.db.insert("notifications", {
            receiverId: post.userId,
            senderId: currentUser._id,
            type: "like",
            postId: args.postId,
          });
        } else {
          console.warn("Post.userId missing or is the current user");
        }

        return true;
      }
    } catch (err) {
      console.error("Error in toggleLike:", err);
      throw err;
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    try {
      // ✅ Verify ownership
      const currentUser = await getAuthenticatedUser(ctx);
      if (!currentUser) throw new Error("User not authenticated");

      const post = await ctx.db.get(args.postId);
      if (!post) throw new Error("Post not found");
      if (post.userId !== currentUser._id) {
        throw new Error("You do not have permission to delete this post");
      }

     // ✅ Delete the storage file
if (post.storageId) {
  await ctx.storage.delete(post.storageId);
}


      // ✅ Delete associated likes
      const likes = await ctx.db
        .query("likes")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect();
      for (const like of likes) {
        await ctx.db.delete(like._id);
      }

      // ✅ Delete associated bookmarks
      const bookmarks = await ctx.db
        .query("bookmarks")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect();
      for (const bookmark of bookmarks) {
        await ctx.db.delete(bookmark._id);
      }

      // ✅ Delete associated comments
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .collect();
      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }

      // ✅ Decrement user's post count by 1
      await ctx.db.patch(currentUser._id, {
        posts: Math.max (0,(currentUser.posts || 1) - 1 ),
      });

      // ✅ Finally delete the post itself
      await ctx.db.delete(args.postId);

    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error("Failed to delete post");
    }
  },
});


export const getPostsByUser = query({
  args:{
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = args.userId ? await ctx.db.get(args.userId) : await getAuthenticatedUser(ctx);

    if (!user) throw new Error ("User not found");

    const posts = await ctx.db 
    .query("posts")
    .withIndex("by_user", (q) => q.eq("userId", args.userId || user._id))
    .collect();

    return posts;
  }
})