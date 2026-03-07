import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Menu, MessageSquare } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { useChatContext } from "../context/ChatContext";

const Navbar = ({ toggleSidebar }) => {
  const { authUser } = useAuthUser();
  const { executeLogout } = useLogout();
  console.log("DEBUG: Navbar using executeLogout. VERSION_CHECK: FINAL_LOGOUT_FIX_VER_2");
  console.log("[NAVBAR] executeLogout defined:", !!executeLogout);
  const location = useLocation();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
  });

  const { unreadCount } = useChatContext();

  const incomingReqs = friendRequests?.incomingReqs || [];
  const totalNotifications = incomingReqs.length + (unreadCount || 0);

  return (
    <nav className="bg-[#0f111a] border-b border-white/5 sticky top-0 z-50 h-20 flex items-center px-4 sm:px-8 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Menu button and Brand */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 transition-colors hover:bg-white/10 rounded-xl md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>

          <Link to="/" className="flex items-center gap-2 group transition-all duration-300 active:scale-95">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <MessageSquare className="h-6 w-6 text-white stroke-[2.5px]" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent hidden sm:block">
              TalkDude
            </span>
          </Link>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Notifications */}
          {authUser && (
            <Link
              to="/notifications"
              className="relative p-2.5 transition-all duration-300 hover:bg-white/10 rounded-2xl group"
            >
              <BellIcon className="h-6 w-6 text-foreground/70 group-hover:text-foreground transition-colors" />
              {totalNotifications > 0 && (
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-background"></span>
                </span>
              )}
            </Link>
          )}

          {/* User Avatar & Logout */}
          {authUser ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <div className="w-12 h-12 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-600 to-purple-600 shadow-xl overflow-hidden">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-background">
                    <img
                      src={authUser?.profilePic || "https://api.dicebear.com/7.x/avataaars/svg?seed=TalkDude"}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div tabIndex={0} className="dropdown-content mt-4 z-[100] menu p-3 bg-[#1a1d2e] shadow-2xl rounded-3xl w-60 border border-white/10 animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-semibold">{authUser.fullName}</p>
                  <p className="text-xs text-foreground/50 truncate">{authUser.email}</p>
                </div>
                <div className="h-px bg-white/5 mx-2 mb-2" />
                <li>
                  <button
                    onClick={() => executeLogout()}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                  >
                    Logout
                    <LogOutIcon className="h-4 w-4" />
                  </button>
                </li>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-premium">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

