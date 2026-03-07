import { useState, useRef } from "react";
import { Plus, Send, Smile, Paperclip } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";

const CustomMessageInput = ({ onSendMessage, onSendAudio }) => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);

    const handleInput = (e) => {
        setText(e.target.value);
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    };

    const handleSend = () => {
        if (!text.trim()) return;
        onSendMessage(text);
        setText("");
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

    return (
        <div className="p-6 bg-transparent relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-end gap-3 glass-dark p-3 rounded-[28px] border border-white/5 focus-within:border-blue-500/30 transition-all duration-500 shadow-2xl">

                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                        <button className="p-3 rounded-2xl glass hover:bg-white/10 text-white/60 hover:text-white transition-all group">
                            <Plus className="size-5 group-hover:rotate-90 transition-transform" />
                        </button>
                        <VoiceRecorder onSend={onSendAudio} />
                    </div>

                    <div className="flex-1 px-2 mb-1.5">
                        <textarea
                            ref={textareaRef}
                            rows="1"
                            value={text}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="w-full min-h-[44px] max-h-[120px] py-3 px-1 bg-transparent border-none outline-none text-[15px] text-white placeholder:text-white/30 resize-none scrollbar-hide leading-relaxed"
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-1.5 mr-1 text-premium">
                        <button className="hidden sm:flex p-3 rounded-2xl glass hover:bg-white/10 text-white/60 hover:text-white transition-all">
                            <Smile className="size-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!text.trim()}
                            className={`p-3.5 rounded-2xl transition-all duration-500 ${text.trim()
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-100 hover:scale-105"
                                    : "bg-white/5 text-white/20 scale-95 opacity-50 cursor-not-allowed"
                                }`}
                        >
                            <Send className={`size-5 ${text.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMessageInput;

