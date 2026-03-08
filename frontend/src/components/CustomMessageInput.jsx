import { useState, useRef } from "react";
import { Plus, Send, Smile, ImageIcon, Camera, FileText } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import ReplyPreview from "./ReplyPreview";
import CameraCapture from "./CameraCapture";

const CustomMessageInput = ({ onSendMessage, onSendAudio }) => {
    const [text, setText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null);

    const handleInput = (e) => {
        setText(e.target.value);
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    };

    const handleSend = () => {
        if (!text.trim()) return;
        onSendMessage(text, replyingTo || null);
        setText("");
        setReplyingTo(null);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const cancelReply = () => {
        setReplyingTo(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onSendMessage("", null, file, false);
            setShowMenu(false);
        }
    };

    const handleDocChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onSendMessage("", null, file, false);
            setShowMenu(false);
        }
    };

    const handleCapture = (blob, isViewOnce) => {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        onSendMessage("", null, file, isViewOnce);
    };

    return (
        <div className="w-full bg-transparent backdrop-blur-md border-none transition-colors duration-300">
            {/* Reply Preview */}
            {replyingTo && (
                <ReplyPreview
                    replyingTo={replyingTo}
                    onCancel={cancelReply}
                />
            )}

            <div className="py-4 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="flex items-end gap-2 sm:gap-4 bg-base-100 p-2 rounded-[24px] sm:rounded-[28px] border border-base-content/5 focus-within:ring-1 focus-within:ring-primary/40 transition-all duration-500 shadow-xl">

                        <div className="flex items-center gap-1 sm:gap-2 mb-1 ml-1 flex-shrink-0 relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all group flex-shrink-0 ${showMenu ? "bg-primary text-primary-content rotate-45" : "bg-base-content/10 text-base-content/60 hover:text-base-content"}`}
                            >
                                <Plus className="size-4 sm:size-5 transition-transform" />
                            </button>

                            {/* Attachment Menu */}
                            {showMenu && (
                                <div className="absolute bottom-full left-0 mb-4 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-300">
                                    <button
                                        onClick={() => { setShowMenu(false); setIsCameraOpen(true); }}
                                        className="p-4 rounded-2xl bg-base-300 border border-base-content/10 text-base-content/60 hover:text-base-content hover:bg-base-200 transition-all shadow-2xl flex items-center gap-3 group/item whitespace-nowrap"
                                    >
                                        <div className="p-2 rounded-xl bg-secondary/10 text-secondary group-hover/item:scale-110 transition-transform">
                                            <Camera className="size-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">Camera</span>
                                    </button>
                                    <button
                                        onClick={() => { setShowMenu(false); fileInputRef.current?.click(); }}
                                        className="p-4 rounded-2xl bg-base-300 border border-base-content/10 text-base-content/60 hover:text-base-content hover:bg-base-200 transition-all shadow-2xl flex items-center gap-3 group/item whitespace-nowrap"
                                    >
                                        <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover/item:scale-110 transition-transform">
                                            <ImageIcon className="size-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">Media</span>
                                    </button>
                                    <button
                                        onClick={() => { setShowMenu(false); docInputRef.current?.click(); }}
                                        className="p-4 rounded-2xl bg-base-300 border border-base-content/10 text-base-content/60 hover:text-base-content hover:bg-base-200 transition-all shadow-2xl flex items-center gap-3 group/item whitespace-nowrap"
                                    >
                                        <div className="p-2 rounded-xl bg-accent/10 text-accent group-hover/item:scale-110 transition-transform">
                                            <FileText className="size-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest leading-none">Document</span>
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                            />

                            <input
                                type="file"
                                ref={docInputRef}
                                className="hidden"
                                onChange={handleDocChange}
                                accept="*/*"
                            />

                            <div className="flex-shrink-0">
                                <VoiceRecorder onSend={onSendAudio} />
                            </div>
                        </div>

                        <div className="flex-1 px-1 sm:px-2 mb-0.5 sm:mb-1 min-w-0">
                            <textarea
                                ref={textareaRef}
                                rows="1"
                                value={text}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full min-h-[44px] max-h-[120px] py-3 bg-transparent border-none outline-none text-[15px] sm:text-base text-base-content placeholder:text-base-content/20 resize-none scrollbar-hide leading-relaxed"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 mr-1 flex-shrink-0">
                            <button className="hidden sm:flex p-3 rounded-2xl bg-base-content/5 hover:bg-base-content/10 text-base-content/60 hover:text-base-content transition-all flex-shrink-0">
                                <Smile className="size-5" />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!text.trim()}
                                className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-500 flex-shrink-0 ${text.trim()
                                    ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-100 hover:scale-105 active:scale-95"
                                    : "bg-base-content/5 text-base-content/10 scale-100 opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                <Send className={`size-5 sm:size-6 ${text.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <CameraCapture
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onCapture={handleCapture}
            />
        </div>
    );
};

export default CustomMessageInput;
