import { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Check, Share2, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isViewOnce, setIsViewOnce] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setIsCameraReady(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera. Please check permissions.");
            onClose();
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraReady(false);
    };

    const takePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
    };

    const handleSend = () => {
        if (!capturedImage) return;

        // Convert base64 to blob
        fetch(capturedImage)
            .then(res => res.blob())
            .then(blob => {
                onCapture(blob, isViewOnce);
                handleClose();
            });
    };

    const handleClose = () => {
        setCapturedImage(null);
        setIsViewOnce(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300 backdrop-blur-3xl">
            <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-4 rounded-full bg-base-content/5 hover:bg-base-content/10 text-base-content/60 hover:text-base-content transition-all z-10 active:scale-95"
            >
                <X className="size-8" />
            </button>

            <div className="relative w-full max-w-2xl aspect-square sm:aspect-video overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-base-content/5 shadow-2xl bg-base-300">
                {!capturedImage ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? "opacity-100" : "opacity-0"}`}
                        />
                        {!isCameraReady && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="size-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                        )}
                        <div className="absolute bottom-10 inset-x-0 flex justify-center">
                            <button
                                onClick={takePhoto}
                                className="size-20 rounded-full bg-white border-8 border-base-content/20 hover:scale-110 active:scale-90 transition-all shadow-2xl"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover animate-in zoom-in duration-500" />

                        <div className="absolute top-6 left-6 flex flex-col gap-3">
                            <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isViewOnce ? "bg-purple-600/20 border-purple-500/50" : "bg-base-content/5 border-base-content/10"}`}>
                                <button
                                    onClick={() => setIsViewOnce(!isViewOnce)}
                                    className="flex items-center gap-3"
                                >
                                    <div className={`p-2 rounded-xl transition-all ${isViewOnce ? "bg-purple-600 text-base-content" : "bg-base-content/10 text-base-content/40"}`}>
                                        <EyeOff className="size-5" />
                                    </div>
                                    <div className="text-left pr-2">
                                        <p className="text-sm font-black text-base-content uppercase tracking-wider">View Once</p>
                                        <p className="text-[10px] font-bold text-base-content/40">{isViewOnce ? "Self-destruct after viewing" : "Normal sharing"}</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="absolute bottom-10 inset-x-8 flex items-center justify-between pointer-events-none">
                            <button
                                onClick={() => { setCapturedImage(null); startCamera(); }}
                                className="p-5 rounded-2xl bg-base-content/5 hover:bg-base-content/10 text-base-content shadow-2xl transition-all active:scale-95 pointer-events-auto"
                            >
                                <RefreshCw className="size-8" />
                            </button>
                            <button
                                onClick={handleSend}
                                className="p-6 px-10 rounded-3xl bg-blue-600 hover:bg-blue-500 text-base-content shadow-2xl shadow-blue-600/40 font-black text-lg tracking-widest flex items-center gap-4 group transition-all active:scale-95 pointer-events-auto"
                            >
                                SEND PHOTO
                                <Share2 className="size-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-10 text-center space-y-2">
                <h3 className="text-xl font-black text-base-content tracking-widest uppercase">
                    {capturedImage ? "Preview & Options" : "Capture Moment"}
                </h3>
                <p className="text-sm font-bold text-base-content/40 uppercase tracking-widest">
                    {capturedImage ? "Choose if you want to share secretly" : "Position yourself and snap a photo"}
                </p>
            </div>
        </div>
    );
};

export default CameraCapture;
