import { useState, useRef, useEffect } from "react";
import { Mic, Square, X, Send, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const VoiceRecorder = ({ onSend, onCancel }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setAudioBlob(null);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            toast.error("Microphone access denied or not available");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSend = async () => {
        if (!audioBlob) return;
        setIsUploading(true);
        try {
            await onSend(audioBlob);
            setAudioBlob(null);
            setRecordingTime(0);
        } catch (error) {
            console.error("Error sending audio:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        stopRecording();
        setAudioBlob(null);
        setRecordingTime(0);
        onCancel?.();
    };

    return (
        <div className="flex items-center gap-3">
            {isRecording ? (
                <div className="flex items-center gap-3 glass-dark border border-red-500/20 px-4 py-2 rounded-2xl animate-in zoom-in duration-300">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                            <div className="w-3 h-3 rounded-full bg-red-500 relative z-10" />
                        </div>
                        <span className="text-sm font-bold font-mono text-red-500 min-w-[40px]">{formatTime(recordingTime)}</span>
                    </div>
                    <div className="w-[2px] h-4 bg-white/10" />
                    <button
                        type="button"
                        onClick={stopRecording}
                        className="p-1.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Stop Recording"
                    >
                        <Square className="size-4 fill-current" />
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 transition-colors"
                        title="Cancel"
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            ) : audioBlob ? (
                <div className="flex items-center gap-3 glass-dark border border-blue-500/20 px-4 py-2 rounded-2xl animate-in zoom-in duration-300">
                    <span className="text-sm font-semibold text-blue-400">Audio Ready ({formatTime(recordingTime)})</span>
                    <div className="w-[2px] h-4 bg-white/10" />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={isUploading}
                            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isUploading}
                            className="p-2 rounded-xl hover:bg-white/10 text-white/60 transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={startRecording}
                    className="p-3 rounded-2xl glass hover:bg-white/10 text-white transition-all group active:scale-95"
                    title="Record Voice"
                >
                    <Mic className="size-5 group-hover:scale-110 group-hover:text-blue-400 transition-all" />
                </button>
            )}
        </div>
    );
};

export default VoiceRecorder;

