import { useState, useRef, useEffect } from "react";
import { Mic, Square, X, Send, Loader2 } from "lucide-react";
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
        <div className="flex items-center gap-3 bg-base-300 p-2 rounded-full px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {isRecording ? (
                <>
                    <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm font-mono w-10">{formatTime(recordingTime)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={stopRecording}
                        className="btn btn-ghost btn-circle btn-sm text-error"
                    >
                        <Square className="size-4 fill-current" />
                    </button>
                </>
            ) : audioBlob ? (
                <>
                    <span className="text-sm font-medium">Recording saved ({formatTime(recordingTime)})</span>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={isUploading}
                            className="btn btn-primary btn-circle btn-sm"
                        >
                            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isUploading}
                            className="btn btn-ghost btn-circle btn-sm"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </>
            ) : (
                <button
                    type="button"
                    onClick={startRecording}
                    className="btn btn-circle btn-sm btn-ghost hover:bg-primary/20 hover:text-primary transition-all group"
                >
                    <Mic className="size-5 group-hover:scale-110" />
                </button>
            )}

            {isRecording && (
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost btn-circle btn-sm"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
};

export default VoiceRecorder;
