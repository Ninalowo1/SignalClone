import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("🚀 Clerk webhook hit");

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ Missing CLERK_WEBHOOK_SECRET");
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    // Verify headers
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      console.error("❌ Missing Svix headers");
      return new Response("Missing Svix headers", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: any;

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_signature,
        "svix-timestamp": svix_timestamp,
      });
      console.log("✅ Webhook verified:", evt.type);
    } catch (err) {
      console.error("❌ Error verifying webhook", err);
      return new Response("Webhook verification failed", { status: 400 });
    }

    // Handle user.created event
    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url, username: clerkUsername } = evt.data;

      if (!email_addresses || email_addresses.length === 0) {
        console.error("❌ No email addresses found in event data");
        return new Response("Invalid event data", { status: 400 });
      }

      const email = email_addresses[0].email_address;
      const fullName = `${first_name || ""} ${last_name || ""}`.trim();

      // Safe fallback for username
      const generatedUsername =
        clerkUsername?.toLowerCase() ||
        `${first_name || ""}${last_name || ""}`.toLowerCase() ||
        email?.split("@")[0] ||
        `user_${id.slice(0, 6)}`;

      console.log("Creating user with:", {
        email,
        fullName,
        clerkId: id,
        username: generatedUsername,
      });

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: fullName || generatedUsername,
          clerkId: id,
          username: generatedUsername,
          image: image_url,
        });
      } catch (error) {
        console.error("❌ Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("✅ Webhook processed", { status: 200 });
  }),
});

export default http;

