import { Video, Info, User, ChevronLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomChatHeader = ({ targetUser, onVideoCall, onOpenSettings }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-base-100/90 border-none sticky top-0 z-50 w-full backdrop-blur-2xl transition-colors duration-300">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-base-content/5 hover:bg-base-content/10 transition-all flex-shrink-0 active:scale-90"
                >
                    <ChevronLeft className="size-5 sm:size-6 text-base-content" />
                </button>

                <div className="relative group flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-lg shadow-blue-500/10">
                        <div className="w-full h-full rounded-[14px] overflow-hidden bg-base-300">
                            <img
                                src={targetUser?.image || targetUser?.profilePic || "/default-avatar.png"}
                                alt={targetUser?.name || "User"}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-base-100" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="font-black text-base sm:text-lg text-base-content leading-tight truncate">
                        {targetUser?.name || targetUser?.fullName || "Chatting..."}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] sm:text-xs text-base-content/40 font-bold uppercase tracking-widest">Active Now</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <button
                    onClick={onOpenSettings}
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-base-content/5 hover:bg-base-content/10 text-base-content transition-all group flex-shrink-0 shadow-lg active:scale-95"
                    title="Chat Settings"
                >
                    <Settings className="size-5 text-base-content/60 group-hover:text-base-content group-hover:rotate-90 transition-all" />
                </button>
                <button
                    onClick={onVideoCall}
                    className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-base-content/5 hover:bg-base-content/10 text-base-content transition-all group flex-shrink-0 shadow-lg active:scale-95"
                    title="Start Video Call"
                >
                    <Video className="size-5 text-blue-500 group-hover:scale-110 transition-transform" />
                </button>
                <button
                    className="hidden sm:flex p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all group flex-shrink-0 shadow-lg active:scale-95"
                    title="User Details"
                >
                    <Info className="size-5 text-white/40 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default CustomChatHeader;

