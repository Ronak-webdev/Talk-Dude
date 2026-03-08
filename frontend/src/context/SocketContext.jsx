import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

const BASE_URL = import.meta.env.MODE === "development" ? `http://${window.location.hostname}:5001` : "/";

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const audioRef = useRef(new Audio("/sounds/reqtone.mp3"));

    useEffect(() => {
        if (authUser) {
            const newSocket = io(BASE_URL, {
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            newSocket.on("new_friend_request", (data) => {
                // Play sound
                audioRef.current.play().catch((err) => console.log("Audio play failed", err));

                toast(`New friend request from ${data.sender}`, {
                    icon: '👋',
                });

                queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
            });

            newSocket.on("friend_request_accepted", (data) => {
                audioRef.current.play().catch((err) => console.log("Audio play failed", err));
                toast.success(`${data.recipientName} accepted your friend request!`, {
                    icon: '🤝',
                });
                queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
                queryClient.invalidateQueries({ queryKey: ["friends"] });
            });

            return () => {
                newSocket.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
