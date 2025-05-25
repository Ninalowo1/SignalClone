import {query} from  '../../convex/_generated/server'
import {getAuthenticatedUser} from "../../convex/users"

export const getNotification = query ({
    handler: async (ctx) => {
 const currentUser = await getAuthenticatedUser (ctx)

 const notifications = await ctx.db.query("notifications")
 .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
 .order("desc")
 .collect()


 const notificationsWithInfo = await Promise.all(
    notifications.map(async (notification) => {

        const sender = await ctx.db.get(notification.senderId)
        let
    })
 )
    }
})