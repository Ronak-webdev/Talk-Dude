import { generateStreamToken, streamClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    const { deleteType } = req.query; // 'me' or 'everyone'
    const userId = req.user.id;

    if (deleteType === "everyone") {
      // Soft delete by default to keep the 'type: deleted' placeholder for others
      await streamClient.deleteMessage(messageId);
      return res.status(200).json({ success: true, message: "Message deleted for everyone" });
    } else {
      // For 'me', typically we just return success and let the frontend handle the state
      // or we could store a list of hidden messages per user in DB.
      return res.status(200).json({ success: true, message: "Message deleted for you" });
    }
  } catch (error) {
    console.error("Error in deleteMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
