import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    username: v.string(), // User's username
    fullname: v.string(), // User's full name
    bio: v.optional(v.string()), // Optional bio
    image: v.string(), // Profile image URL
    followers: v.number(), // Number of followers
    following: v.number(), // Number of users the user is following
    posts: v.number(), // Number of posts created by the user
    clerkId: v.string(), // Clerk ID for authentication
    email: v.string(), // User's email address
  }).index("by_clerk_id", ["clerkId"]), // Index to query users by Clerk ID

  // Posts table
  posts: defineTable({
    userId: v.id("users"), // Reference to the user who created the post
    imageUrl: v.string(), // URL of the post's image
    storageId: v.id("_storage"), // Reference to the storage object for the post's image
    caption: v.optional(v.string()), // Optional caption for the post
    likes: v.number(), // Number of likes on the post
    comments: v.number(), // Number of comments on the post
    createdAt: v.number(), // Add this field
  }).index("by_user", ["userId"]), // Index to query posts by user ID

  // Likes table
  likes: defineTable({
    userId: v.id("users"), // Reference to the user who liked the post
    postId: v.id("posts"), // Reference to the liked post
  })
    .index("by_post", ["postId"]) // Index to query likes by post ID
    .index("by_user_and_post", ["userId", "postId"]), // Index to query likes by user and post

  // Comments table
  comments: defineTable({
    userId: v.id("users"), // Reference to the user who commented
    postId: v.id("posts"), // Reference to the post being commented on
    content: v.string(), // Content of the comment
  }).index("by_post", ["postId"]), // Index to query comments by post ID

  // Follows table
  follows: defineTable({
    followerId: v.id("users"), // Reference to the user who is following
    followingId: v.id("users"), // Reference to the user being followed
  })
    .index("by_follower", ["followerId"]) // Index to query follows by follower
    .index("by_following", ["followingId"]) // Index to query follows by following
    .index("by_both", ["followerId", "followingId"]), // Index to query follows by both follower and following

  // Notifications table
  notifications: defineTable({
    receiverId: v.id("users"), // Reference to the user receiving the notification
    senderId: v.id("users"), // Reference to the user sending the notification
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")), // Type of notification
    postId: v.optional(v.id("posts")), // Optional reference to the post (for "like" or "comment" notifications)
    commentId: v.optional(v.id("comments")), // Optional reference to the comment (for "comment" notifications)
  }).index("by_receiver", ["receiverId"]), // Index to query notifications by receiver

  // Bookmarks table
  bookmarks: defineTable({
    userId: v.id("users"), // Reference to the user who bookmarked the post
    postId: v.id("posts"), // Reference to the bookmarked post
  })
    .index("by_user", ["userId"]) // Index to query bookmarks by user
    .index("by_post", ["postId"]) // Index to query bookmarks by post
    .index("by_user_and_post", ["userId", "postId"]), // Index to query bookmarks by user and post
});