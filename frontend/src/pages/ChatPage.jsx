import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { useChatContext } from "../context/ChatContext";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CustomChatHeader from "../components/CustomChatHeader";
import CustomMessageList from "../components/CustomMessageList";
import CustomMessageInput from "../components/CustomMessageInput";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const { chatClient } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null);

  const { authUser } = useAuthUser();

  useEffect(() => {
    const createChannel = async () => {
      if (!chatClient || !authUser) return;

      const channelId = [authUser._id, targetUserId].sort().join("-");

      const currChannel = chatClient.channel("messaging", channelId, {
        members: [authUser._id, targetUserId],
      });

      const state = await currChannel.watch();

      // Get target user info from members
      const otherMember = Object.values(state.members).find(m => m.user.id !== authUser._id);
      if (otherMember) {
        setTargetUser(otherMember.user);
      }

      setChannel(currChannel);
      setLoading(false);
    };

    createChannel();
  }, [chatClient, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `🎥 I've started a video call. Click here to join: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleSendMessage = async (text) => {
    if (!channel) return;
    try {
      await channel.sendMessage({ text });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleSendAudio = async (blob) => {
    if (!channel || !blob) return;

    try {
      const filename = `voice-message-${Date.now()}.webm`;
      const file = new File([blob], filename, { type: "audio/webm" });

      // Upload to Stream CDN
      const response = await channel.sendFile(file);

      // Send message with audio attachment
      await channel.sendMessage({
        attachments: [
          {
            type: "audio",
            asset_url: response.file,
            title: filename,
            audio_url: response.file,
          },
        ],
      });

      toast.success("Voice message sent!");
    } catch (error) {
      console.error("Error uploading/sending audio:", error);
      toast.error("Failed to send voice message");
      throw error;
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[140px]" />
      </div>

      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden relative z-10">
            <CustomChatHeader
              targetUser={targetUser}
              onVideoCall={handleVideoCall}
            />

            <CustomMessageList authUserId={authUser._id} />

            <CustomMessageInput
              onSendMessage={handleSendMessage}
              onSendAudio={handleSendAudio}
            />
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;

