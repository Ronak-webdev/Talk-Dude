import { useEffect, useRef } from "react";
import { useChannelStateContext } from "stream-chat-react";

const CustomMessageList = ({ authUserId }) => {
    const { messages } = useChannelStateContext();
    const scrollRef = useRef(null);

    const formatTime = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(date));
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-premium custom-message-list bg-transparent relative"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

            {messages.map((message, idx) => {
                const isMe = message.user.id === authUserId;
                const time = message.created_at ? formatTime(message.created_at) : "";

                return (
                    <div
                        key={message.id || idx}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        <div className={`flex items-end gap-3 max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                            <div className="avatar shrink-0 mb-1 group">
                                <div className="w-10 h-10 rounded-2xl overflow-hidden border border-white/5 shadow-xl glass-dark group-hover:scale-110 transition-transform">
                                    <img src={message.user.image || "/default-avatar.png"} alt="User" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div
                                    className={`px-5 py-3.5 rounded-3xl text-[15px] shadow-2xl relative transition-all hover:scale-[1.01] ${isMe
                                        ? "chat-bubble-user"
                                        : "chat-bubble-alt"
                                        }`}
                                >
                                    {message.text && <p className="leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>}

                                    {message.attachments?.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            {message.attachments.map((attachment, aIdx) => {
                                                if (attachment.type === "audio") {
                                                    return (
                                                        <div key={aIdx} className={`p-4 rounded-2xl glass-dark border border-white/10 ${isMe ? "bg-white/5" : "bg-black/20"}`}>
                                                            <audio controls src={attachment.asset_url || attachment.audio_url} className="w-full h-10 filter brightness-110 contrast-125" />
                                                        </div>
                                                    );
                                                }
                                                if (attachment.type === "image") {
                                                    return (
                                                        <div key={aIdx} className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                                                            <img src={attachment.image_url} alt="attachment" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-[11px] font-medium opacity-40 mt-2 mx-12 uppercase tracking-wider">
                            {time}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomMessageList;

