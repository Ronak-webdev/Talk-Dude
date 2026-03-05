import { createContext, useContext, useEffect, useState, useRef } from "react";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import toast from "react-hot-toast";

const ChatContext = createContext();
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useChatContext = () => {
    return useContext(ChatContext);
};

export const ChatContextProvider = ({ children }) => {
    const { authUser } = useAuthUser();
    const [chatClient, setChatClient] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioRef = useRef(new Audio("/sounds/msgtone.mp3"));

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser,
    });

    useEffect(() => {
        if (!authUser || !tokenData?.token) return;

        const client = StreamChat.getInstance(STREAM_API_KEY);

        const connectUser = async () => {
            try {
                if (!client.userID) {
                    await client.connectUser(
                        {
                            id: authUser._id,
                            name: authUser.fullName,
                            image: authUser.profilePic,
                        },
                        tokenData.token
                    );
                }

                setChatClient(client);

                // Track unread count
                if (client.user?.total_unread_count !== undefined) {
                    setUnreadCount(client.user.total_unread_count);
                }

                const handleEvent = (event) => {
                    if (client.user?.total_unread_count !== undefined) {
                        setUnreadCount(client.user.total_unread_count);
                    }
                };

                client.on("notification.message_new", handleEvent);
                client.on("notification.mark_read", handleEvent);
                client.on("message.read", handleEvent);
                client.on("message.new", handleEvent); // catch-all

                // Global event listener for new messages for sound and toast
                client.on("message.new", (event) => {
                    if (event.user.id === authUser._id) return;

                    // Play sound
                    audioRef.current.play().catch(e => console.log("Audio play failed", e));

                    const isSmallDevice = window.innerWidth < 768;
                    const isChatOpen = window.location.pathname.includes(`/chat/${event.user.id}`);

                    if (isSmallDevice && !isChatOpen) {
                        toast(`${event.user.name}: ${event.message.text}`, {
                            icon: '💬',
                        });
                    }
                });

            } catch (error) {
                console.error("Failed to connect Stream Chat user", error);
            }
        };

        connectUser();

        return () => {
            // client.disconnectUser();
            client.off("message.new");
            client.off("notification.message_new");
            client.off("notification.mark_read");
            client.off("message.read");
        };

    }, [authUser, tokenData]);

    // Handle logout/disconnect if needed
    useEffect(() => {
        if (!authUser && chatClient) {
            chatClient.disconnectUser();
            setChatClient(null);
            setUnreadCount(0);
        }
    }, [authUser, chatClient]);


    return (
        <ChatContext.Provider value={{ chatClient, unreadCount }}>
            {children}
        </ChatContext.Provider>
    );
};
