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
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const { chatClient } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  useEffect(() => {
    const createChannel = async () => {
      if (!chatClient || !authUser) return;

      const channelId = [authUser._id, targetUserId].sort().join("-");

      const currChannel = chatClient.channel("messaging", channelId, {
        members: [authUser._id, targetUserId],
      });

      await currChannel.watch();

      setChannel(currChannel);
      setLoading(false);
    };

    createChannel();
  }, [chatClient, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const baseUrl = import.meta.env.VITE_CLIENT_URL || window.location.origin;
      const callUrl = `${baseUrl}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
