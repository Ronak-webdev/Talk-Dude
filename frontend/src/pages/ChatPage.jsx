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
import ChatSettings from "../components/ChatSettings";
import SystemMessage from "../components/SystemMessage";
import NewMessageIndicator from "../components/NewMessageIndicator";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const { chatClient } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemMessages, setSystemMessages] = useState([]);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const messageListRef = useRef(null);

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

  // Initialize screenshot detection
  useEffect(() => {
    if (!channel || !authUser) return;

    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || e.key === 'PrtSc' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        addSystemMessage('screenshot');
        toast.error('Screenshot detected!', {
          icon: '⚠️',
          duration: 3000,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [channel, authUser]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `🎥 I've started a video call. Click here to join: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleSendMessage = async (text, replyingTo = null, file = null, isViewOnce = false) => {
    if (!channel) return;
    try {
      const messageData = { text };

      if (replyingTo) {
        messageData.quoted_message_id = replyingTo.id;
        messageData.parent_id = replyingTo.parent_id || null;
      }

      if (file) {
        toast.loading("Uploading file...", { id: "uploading" });
        const response = await channel.sendFile(file);
        toast.dismiss("uploading");

        const isImage = file.type.startsWith("image");
        messageData.attachments = [
          {
            type: isImage ? "image" : "file",
            asset_url: response.file,
            image_url: isImage ? response.file : undefined, // Ensure image_url is set for images
            file_size: file.size,
            mime_type: file.type,
            title: file.name,
            oneTimeView: isViewOnce, // Custom metadata for view once
          },
        ];

        if (isViewOnce) {
          messageData.text = messageData.text || "📷 Shared a one-time view image";
        }
      }

      await channel.sendMessage(messageData);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.dismiss("uploading");
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


  const addSystemMessage = async (type) => {
    const systemMsg = {
      id: `sys-${Date.now()}`,
      type: 'system',
      messageType: type,
      username: type === 'screenshot' ? authUser.fullName : 'System',
      timestamp: new Date().toLocaleTimeString(),
    };

    setSystemMessages(prev => [...prev, systemMsg]);

    // In real implementation, save to backend
    console.log('System message:', systemMsg);
  };

  // Handle new message notification from CustomMessageList
  const handleNewMessageReceived = (count) => {
    setShowNewMessageIndicator(true);
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-transparent relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" />
      </div>

      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="flex-1 flex flex-col min-w-0 w-full relative z-10 overflow-hidden">
            <CustomChatHeader
              targetUser={targetUser}
              onVideoCall={handleVideoCall}
              onOpenSettings={() => setSettingsOpen(true)}
            />

            <div className="flex-1 overflow-y-auto min-h-0 bg-base-100/30">
              <CustomMessageList 
                ref={messageListRef}
                authUserId={authUser._id} 
                onNewMessageReceived={handleNewMessageReceived}
              />

              {/* System Messages */}
              {systemMessages.map((msg) => (
                <SystemMessage
                  key={msg.id}
                  type={msg.messageType}
                  username={msg.username}
                  timestamp={msg.timestamp}
                />
              ))}
            </div>

            <div className="flex-shrink-0 border-none bg-base-200/50">
              <CustomMessageInput
                onSendMessage={handleSendMessage}
                onSendAudio={handleSendAudio}
              />
            </div>
          </div>
          <Thread />
        </Channel>
      </Chat>

      {/* Chat Settings Modal */}
      <ChatSettings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        channel={channel}
        targetUser={targetUser}
      />

      {/* New Message Indicator */}
      {showNewMessageIndicator && (
        <NewMessageIndicator
          onClick={() => {
            if (messageListRef.current) {
              messageListRef.current.scrollToBottom(true);
            }
            setShowNewMessageIndicator(false);
          }}
        />
      )}
    </div>
  );
};
export default ChatPage;

