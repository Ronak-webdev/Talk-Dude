import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    console.log(`[AUTH MIDDLEWARE] Processing request for Clerk ID: ${userId || "None"}`);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No Clerk session found" });
    }

    let user = await User.findOne({ clerkId: userId }).select("-password");

    if (!user) {
      console.log(`[AUTH SYNC] User with Clerk ID ${userId} not found in DB. Attempting sync...`);
      // Auto-sync: If user exists in Clerk but not in our DB, create them
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        console.log(`[AUTH SYNC] Clerk User Email: ${email}`);

        // Check if user exists by email (previous manual account)
        user = await User.findOne({ email }).select("-password");

        if (user) {
          // Link Clerk ID to existing account
          console.log(`[AUTH SYNC] Linking existing user email ${email} to Clerk ID ${userId}`);
          user.clerkId = userId;
          await user.save();
        } else {
          // Create new user record
          console.log(`[AUTH SYNC] Creating new user for Clerk ID ${userId} (Email: ${email})`);
          user = await User.create({
            clerkId: userId,
            email,
            fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Clerk User",
            profilePic: clerkUser.imageUrl || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`,
          });
        }

        console.log(`[AUTH SYNC] Success. DB User ID: ${user._id}`);

        // Also sync with Stream
        await upsertStreamUser({
          id: user._id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        });

      } catch (syncError) {
        console.error("Error syncing Clerk user:", syncError);
        return res.status(401).json({ message: "Unauthorized - User sync failed" });
      }
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("!!! AUTH MIDDLEWARE ERROR !!!");
    console.error("Method:", req.method, "Path:", req.path);
    console.error("Error Message:", error.message);

    if (error.clerk_error) {
      console.error("Clerk Error Context:", JSON.stringify(error, null, 2));
    } else {
      console.error("Stack Trace:", error.stack);
    }

    return res.status(500).json({
      message: "Internal Server Error during auth sync",
      details: error.message
    });
  }
};
