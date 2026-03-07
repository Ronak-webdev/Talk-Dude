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
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent custom-message-list bg-base-200/30"
        >
            {messages.map((message, idx) => {
                const isMe = message.user.id === authUserId;
                const time = message.created_at ? formatTime(message.created_at) : "";

                return (
                    <div
                        key={message.id || idx}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                            <div className="avatar shrink-0 mb-1">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-base-300">
                                    <img src={message.user.image || "/default-avatar.png"} alt="User" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group ${isMe
                                        ? "bg-primary text-primary-content rounded-tr-none"
                                        : "bg-base-100 text-base-content rounded-tl-none border border-base-300"
                                        }`}
                                >
                                    {message.text && <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>}

                                    {message.attachments?.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {message.attachments.map((attachment, aIdx) => {
                                                if (attachment.type === "audio") {
                                                    return (
                                                        <div key={aIdx} className={`p-2 rounded-lg ${isMe ? "bg-primary-focus/20" : "bg-base-200"}`}>
                                                            <audio controls src={attachment.asset_url || attachment.audio_url} className="w-full h-8 scale-90" />
                                                        </div>
                                                    );
                                                }
                                                if (attachment.type === "image") {
                                                    return <img key={aIdx} src={attachment.image_url} alt="attachment" className="rounded-lg max-w-full" />;
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] opacity-50 mt-1 mx-10">
                            {time}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomMessageList;
