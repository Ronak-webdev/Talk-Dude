import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { Bell, Home, MessageSquare, Users, X, Settings, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { useChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
  });

  const { unreadCount } = useChatContext();

  const incomingReqs = friendRequests?.incomingReqs || [];
  const totalNotifications = incomingReqs.length + (unreadCount || 0);

  const navItems = [
    { label: "Overview", path: "/", icon: Home },
    { label: "Community", path: "/friends", icon: Users },
    { label: "Updates", path: "/notifications", icon: Bell, badge: totalNotifications },
  ];

  return (
    <aside className="w-full flex flex-col h-full bg-transparent p-6">
      {/* Close button for mobile */}
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={() => document.querySelector('.drawer-toggle').click()}
          className="p-2 rounded-xl hover:bg-white/5 text-white/60 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Brand */}
      <div className="mb-10 group">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            TalkDude
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[2px] ml-3 mb-4">Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${currentPath === item.path
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            onClick={() => window.innerWidth < 1024 && document.querySelector('.drawer-toggle').click()}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${currentPath === item.path ? "text-white" : "text-white/40"}`} />
              <span className="font-semibold text-[15px]">{item.label}</span>
            </div>
            {item.badge > 0 && (
              <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <Link
          to="/onboarding"
          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group"
          onClick={() => window.innerWidth < 1024 && document.querySelector('.drawer-toggle').click()}
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-[1px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-xl overflow-hidden bg-background">
                <img
                  src={authUser?.profilePic || '/default-avatar.png'}
                  alt={authUser?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-[3px] border-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[15px] text-white truncate">{authUser?.fullName || 'User'}</p>
            <p className="text-[11px] text-white/40 font-medium">View Profile</p>
          </div>
          <Settings className="size-4 text-white/30 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
