import { Video, Info, User, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomChatHeader = ({ targetUser, onVideoCall }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between px-6 py-4 glass-dark border-b border-white/5 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                    <ChevronLeft className="size-6" />
                </button>

                <div className="relative group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] transition-transform group-hover:scale-105">
                        <div className="w-full h-full rounded-[14px] overflow-hidden bg-background">
                            <img
                                src={targetUser?.image || targetUser?.profilePic || "/default-avatar.png"}
                                alt={targetUser?.name || "User"}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-4 border-background" />
                </div>

                <div>
                    <h3 className="font-bold text-lg text-white leading-tight">
                        {targetUser?.name || targetUser?.fullName || "Chatting..."}
                    </h3>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onVideoCall}
                    className="p-3 rounded-2xl glass hover:bg-white/10 text-white transition-all group"
                    title="Start Video Call"
                >
                    <Video className="size-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                    className="p-3 rounded-2xl glass hover:bg-white/10 text-white transition-all group"
                    title="User Details"
                >
                    <Info className="size-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default CustomChatHeader;

