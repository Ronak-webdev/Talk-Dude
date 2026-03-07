import { useState, useRef } from "react";
import { Plus, Send, Smile, Paperclip } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";

const CustomMessageInput = ({ onSendMessage, onSendAudio }) => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);

    const handleInput = (e) => {
        setText(e.target.value);
        // Auto-resize textarea
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
        <div className="p-3 sm:p-4 bg-base-100 border-t border-base-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end gap-2 bg-base-200 p-2 rounded-2xl shadow-inner-lg border border-base-300 focus-within:border-primary/50 transition-all duration-300">

                    <div className="flex items-center gap-1 pb-1 ml-1">
                        <button className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10 text-base-content/60 hover:text-primary">
                            <Plus className="size-5" />
                        </button>
                        <VoiceRecorder onSend={onSendAudio} />
                    </div>

                    <div className="flex-1 px-1">
                        <textarea
                            ref={textareaRef}
                            rows="1"
                            value={text}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="textarea textarea-ghost w-full min-h-[40px] max-h-[120px] py-2 px-1 focus:bg-transparent focus:outline-none text-base bg-transparent resize-none scrollbar-hide border-none"
                        />
                    </div>

                    <div className="flex items-center gap-1 pb-1 mr-1">
                        <button className="btn btn-ghost btn-circle btn-sm hover:bg-warning/10 text-base-content/60 hover:text-warning hidden sm:flex">
                            <Smile className="size-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!text.trim()}
                            className={`btn btn-circle btn-sm ${text.trim() ? "btn-primary shadow-lg shadow-primary/20" : "btn-ghost opacity-40 cursor-not-allowed"}`}
                        >
                            <Send className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMessageInput;
