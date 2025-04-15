import { mutation, MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";


export const createUser = mutation ({ 
args: v.object({
username: v.string(),
fullname:v.string(),
bio: v.optional(v.string()),
email: v.string(),  
image: v.string(),
clerkId: v.string(),

}),

handler: async (ctx, args) => {
const existingUser = await ctx.db
.query("users")
.withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
.first();


if (existingUser) return;

    // create a user in database
await ctx.db.insert("users", { 
    username: args.username,
    fullname: args.fullname,
    email: args.email,
    bio: args.bio,
    image: args.image,
    clerkId: args.clerkId,
    followers: 0,
    following: 0,
    posts: 0,
});
}
})

export async function getAuthenticatedUser(ctx:QueryCtx | MutationCtx) { 
const identity = await ctx.auth.getUserIdentity(); // Fixed typo
if (!identity) throw new Error("Unauthorized");

const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

if (!currentUser) throw new Error("User not found");

return currentUser;

}