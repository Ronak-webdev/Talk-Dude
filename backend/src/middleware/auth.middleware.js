import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No Clerk session found" });
    }

    let user = await User.findOne({ clerkId: userId }).select("-password");

    if (!user) {
      // Auto-sync: If user exists in Clerk but not in our DB, create them
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        // Check if user exists by email (previous manual account)
        user = await User.findOne({ email }).select("-password");

        if (user) {
          // Link Clerk ID to existing account
          user.clerkId = userId;
          await user.save();
        } else {
          // Create new user record
          user = await User.create({
            clerkId: userId,
            email,
            fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Clerk User",
            profilePic: clerkUser.imageUrl || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`,
          });
        }

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
    console.error("CRITICAL error in protectRoute middleware:", error);
    // Log details if it's a Clerk error
    if (error.clerk_error) {
      console.error("Clerk Error Data:", JSON.stringify(error, null, 2));
    }
    return res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
};
