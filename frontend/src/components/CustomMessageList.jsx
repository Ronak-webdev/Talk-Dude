import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { useChannelStateContext } from "stream-chat-react";
import MessageContextMenu from "./MessageContextMenu";
import OneTimeImageView from "./OneTimeImageView";
import { FileText, Download } from "lucide-react";
import useLongPress from "../hooks/useLongPress";
import { deleteMessage } from "../lib/api";
import { formatRelativeTime } from "../lib/utils";
import toast from "react-hot-toast";

const CustomMessageList = forwardRef(({ authUserId, onNewMessageReceived }, ref) => {
    const { messages } = useChannelStateContext();
    const scrollRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({
        isOpen: false,
        position: { x: 0, y: 0 },
        selectedMessage: null,
    });
    const [deletedMessages, setDeletedMessages] = useState(new Set());
    const [viewedOnceImages, setViewedOnceImages] = useState(new Set());
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
    const previousMessageCountRef = useRef(0);
    const hideIndicatorTimeoutRef = useRef(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [, setTick] = useState(0); // For forcing re-renders every minute

    const renderTextWithLinks = (text) => {
        if (!text) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-300 break-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const formatTime = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(date));
    };

    const formatDateSeparator = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if it's today
        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        }

        // Check if it's yesterday
        if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        // Otherwise show full date
        return messageDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    const shouldShowDateSeparator = (currentMessage, previousMessage) => {
        if (!previousMessage) return true;

        const currentDate = new Date(currentMessage.created_at);
        const prevDate = new Date(previousMessage.created_at);

        return currentDate.toDateString() !== prevDate.toDateString();
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Detect if user is scrolled up
    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const threshold = 100; // pixels from bottom to consider "scrolled up"

        const isScrolledUp = scrollHeight - scrollTop - clientHeight > threshold;
        setIsUserScrolledUp(isScrolledUp);
    };

    // Scroll to bottom with smooth animation
    const scrollToBottom = (smooth = true) => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto',
        });
    };

    // Handle new messages
    useEffect(() => {
        const currentCount = messages.length;
        const previousCount = previousMessageCountRef.current;

        // Only check for new messages after initial load
        if (previousCount > 0 && currentCount > previousCount) {
            const newMessagesCount = currentCount - previousCount;
            const lastMessage = messages[messages.length - 1];
            const isFromOtherUser = lastMessage?.user.id !== authUserId;

            if (isFromOtherUser && isUserScrolledUp) {
                // User is scrolled up and message is from other user
                // Show indicator instead of auto-scrolling
                setNewMessageCount(prev => prev + newMessagesCount);

                // Notify parent component about new message
                if (onNewMessageReceived) {
                    onNewMessageReceived(newMessagesCount);
                }

                // Hide indicator after 2 seconds
                if (hideIndicatorTimeoutRef.current) {
                    clearTimeout(hideIndicatorTimeoutRef.current);
                }

                hideIndicatorTimeoutRef.current = setTimeout(() => {
                    setNewMessageCount(0);
                }, 2000);
            } else if (!isUserScrolledUp || !isFromOtherUser) {
                // User is at bottom or it's their own message - auto-scroll
                scrollToBottom(true);
            }
        }

        previousMessageCountRef.current = currentCount;
    }, [messages, authUserId, isUserScrolledUp, onNewMessageReceived]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hideIndicatorTimeoutRef.current) {
                clearTimeout(hideIndicatorTimeoutRef.current);
            }
        };
    }, []);

    // Add scroll event listener
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        scrollElement.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollElement.removeEventListener('scroll', handleScroll);
    }, []);

    // Expose scrollToBottom to parent via ref
    useImperativeHandle(ref, () => ({
        scrollToBottom: (smooth = true) => scrollToBottom(smooth),
    }));

    // Live timer for relative time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 30000); // 30s to be responsive for "Now" -> "1m"
        return () => clearInterval(interval);
    }, []);

    const handleContextMenu = (e, message) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenu({
            isOpen: true,
            position: { x: e.clientX, y: e.clientY },
            selectedMessage: message,
        });
    };

    const handleLongPress = (message) => {
        // For mobile - show context menu at center of screen
        const rect = document.querySelector(`[data-message-id="${message.id}"]`)?.getBoundingClientRect();
        if (rect) {
            setContextMenu({
                isOpen: true,
                position: {
                    x: Math.min(rect.left + rect.width / 2 - 100, window.innerWidth - 220),
                    y: Math.min(rect.top + rect.height / 2, window.innerHeight - 300)
                },
                selectedMessage: message,
            });
        }
    };

    const handleDelete = async (deleteType) => {
        if (!contextMenu.selectedMessage) return;

        try {
            await deleteMessage(contextMenu.selectedMessage.id, deleteType);

            if (deleteType === 'me') {
                setDeletedMessages(prev => new Set(prev).add(contextMenu.selectedMessage.id));
                toast.success('Message deleted for you');
            } else {
                toast.success('Message deleted for everyone');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

    const handleReply = () => {
        // This will be handled by parent component
        console.log('Reply to message:', contextMenu.selectedMessage);
        toast.info('Reply feature coming soon');
    };

    const handleViewOnce = () => {
        console.log('View once image:', contextMenu.selectedMessage);
        toast.info('Opening one-time view image');
    };

    const closeContextMenu = () => {
        setContextMenu(prev => ({ ...prev, isOpen: false, selectedMessage: null }));
    };

    const handleImageMarkedAsViewed = (messageId) => {
        setViewedOnceImages(prev => new Set(prev).add(messageId));
    };

    // Long press hook
    const { handlers: longPressHandlers } = useLongPress((e) => {
        if (contextMenu.selectedMessage) {
            handleLongPress(contextMenu.selectedMessage);
        }
    }, { delay: 500 });

    return (
        <>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 scrollbar-premium custom-message-list bg-transparent relative min-h-0"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />

                {messages.map((message, idx) => {
                    const isMe = message.user.id === authUserId;
                    const time = message.created_at ? formatTime(message.created_at) : "";
                    const isDeletedByMe = deletedMessages.has(message.id);
                    const isDeletedByEveryone = message.type === 'deleted';
                    const hasOneTimeImage = message.attachments?.some(a => a.type === 'image' && a.oneTimeView);
                    const isImageViewed = viewedOnceImages.has(message.id);
                    const previousMessage = messages[idx - 1];
                    const showDateSeparator = shouldShowDateSeparator(message, previousMessage);

                    // Skip rendering if image was viewed once or deleted for me
                    if ((hasOneTimeImage && isImageViewed) || isDeletedByMe) return null;

                    return (
                        <div key={message.id || idx}>
                            {/* Date Separator */}
                            {showDateSeparator && (
                                <div className="flex items-center justify-center my-6">
                                    <div className="px-4 py-2 bg-base-300/80 backdrop-blur-sm rounded-2xl border border-base-content/5">
                                        <span className="text-xs font-black text-base-content/40 uppercase tracking-widest">
                                            {formatDateSeparator(message.created_at)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div
                                data-message-id={message.id}
                                className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                                onContextMenu={(e) => handleContextMenu(e, message)}
                                {...longPressHandlers}
                            >
                                <div className={`flex items-end gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className="flex flex-col min-w-0">
                                        {isDeletedByEveryone ? (
                                            <div className="px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-3xl text-[14px] sm:text-[15px] shadow-2xl bg-base-content/[0.03] border border-base-content/[0.02]">
                                                <p className="italic text-base-content/40 font-medium">This message was deleted</p>
                                            </div>
                                        ) : (
                                            <div
                                                className={`rounded-[20px] text-[14px] sm:text-[15px] relative transition-all hover:scale-[1.01] cursor-pointer select-none ${message.text
                                                    ? (isMe ? "chat-bubble-user px-4 py-2.5 sm:px-5 sm:py-3.5" : "chat-bubble-alt px-4 py-2.5 sm:px-5 sm:py-3.5")
                                                    : "bg-transparent p-0"}`}
                                                onMouseEnter={() => setHoveredMessageId(message.id)}
                                                onMouseLeave={() => setHoveredMessageId(null)}
                                                onClick={() => setHoveredMessageId(hoveredMessageId === message.id ? null : message.id)}
                                            >
                                                {/* Relative Time Overlay */}
                                                {(hoveredMessageId === message.id && !isDeletedByEveryone) && (
                                                    <div className={`absolute -top-6 ${isMe ? "right-2" : "left-2"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                                        <span className="text-[10px] font-black text-base-content/30 uppercase tracking-[0.2em] whitespace-nowrap">
                                                            {formatRelativeTime(message.created_at)}
                                                        </span>
                                                    </div>
                                                )}

                                                {message.text && <p className="leading-relaxed whitespace-pre-wrap font-medium break-words">{renderTextWithLinks(message.text)}</p>}

                                                {message.attachments?.length > 0 && (
                                                    <div className="mt-3 sm:mt-4 space-y-3">
                                                        {message.attachments.map((attachment, aIdx) => {
                                                            const isAudio = attachment.type === "audio" ||
                                                                attachment.type === "voice" ||
                                                                (attachment.type === "file" && attachment.mime_type?.startsWith("audio/"));

                                                            if (isAudio) {
                                                                const audioUrl = attachment.asset_url || attachment.audio_url || attachment.url;
                                                                if (!audioUrl) return null;

                                                                return (
                                                                    <div key={aIdx} className={`p-2 rounded-[20px] bg-black/20 border-none min-w-[240px] sm:min-w-[280px]`}>
                                                                        <audio
                                                                            controls
                                                                            preload="metadata"
                                                                            crossOrigin="anonymous"
                                                                            src={audioUrl}
                                                                            className="w-full h-10 block focus:outline-none"
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                            if (attachment.type === "image") {
                                                                // Check if it's a one-time view image
                                                                if (attachment.oneTimeView) {
                                                                    return (
                                                                        <div key={aIdx}>
                                                                            <OneTimeImageView
                                                                                imageUrl={attachment.image_url}
                                                                                onMarkAsViewed={() => handleImageMarkedAsViewed(message.id)}
                                                                                isSender={!isMe}
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                                // Regular image
                                                                return (
                                                                    <div key={aIdx} className="relative group overflow-hidden rounded-[20px] border-none">
                                                                        <img src={attachment.image_url} alt="attachment" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </div>
                                                                );
                                                            }

                                                            // File/Document attachment
                                                            if (attachment.type === "file" || attachment.type === "document") {
                                                                return (
                                                                    <div key={aIdx} className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border-none hover:bg-white/[0.05] transition-all group/file max-w-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-500 group-hover/file:scale-110 transition-transform">
                                                                                <FileText className="size-6" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-[14px] font-bold text-white truncate uppercase tracking-wider">{attachment.title || "Document"}</p>
                                                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-0.5">
                                                                                    {attachment.file_size ? `${(attachment.file_size / 1024 / 1024).toFixed(2)} MB` : "File"}
                                                                                </p>
                                                                            </div>
                                                                            <a
                                                                                href={attachment.asset_url || attachment.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white/40 hover:text-white transition-all shadow-xl"
                                                                            >
                                                                                <Download className="size-5" />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            // Video Call attachment
                                                            if (attachment.type === "video_call") {
                                                                const callUrl = attachment.call_url || attachment.asset_url;
                                                                return (
                                                                    <div key={aIdx} className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/20 hover:bg-blue-600/30 transition-all group/call max-w-sm">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="p-3 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30 group-hover/call:scale-110 transition-transform">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className="text-sm font-black text-white uppercase tracking-widest">Incoming Call</p>
                                                                                <p className="text-xs text-white/60 font-medium mt-1">Tap to join the session</p>
                                                                            </div>
                                                                            <a
                                                                                href={callUrl}
                                                                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl active:scale-95"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                }}
                                                                            >
                                                                                Join
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Context Menu */}
            <MessageContextMenu
                isOpen={contextMenu.isOpen}
                position={contextMenu.position}
                onClose={closeContextMenu}
                onDelete={handleDelete}
                onReply={handleReply}
                onViewOnce={handleViewOnce}
                isOwnMessage={contextMenu.selectedMessage?.user.id === authUserId}
                hasImage={contextMenu.selectedMessage?.attachments?.some(a => a.type === 'image')}
            />
        </>
    );
});

export default CustomMessageList;
