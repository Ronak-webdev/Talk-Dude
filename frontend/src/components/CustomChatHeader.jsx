import { VideoIcon, Phone } from "lucide-react";

const CustomChatHeader = ({ targetUser, onVideoCall }) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="avatar online">
                    <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                        <img
                            src={targetUser?.image || targetUser?.profilePic || "/default-avatar.png"}
                            alt={targetUser?.name || "User"}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-base text-base-content leading-tight">
                        {targetUser?.name || targetUser?.fullName || "Chatting..."}
                    </h3>
                    <p className="text-xs text-success flex items-center gap-1 opacity-80">
                        Online
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onVideoCall}
                    className="btn btn-ghost btn-circle btn-sm hover:bg-success/20 hover:text-success transition-all duration-300"
                    title="Start Video Call"
                >
                    <VideoIcon className="size-5" />
                </button>
                <button
                    className="btn btn-ghost btn-circle btn-sm hover:bg-primary/20 hover:text-primary transition-all duration-300"
                    title="More info"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </button>
            </div>
        </div>
    );
};

export default CustomChatHeader;
