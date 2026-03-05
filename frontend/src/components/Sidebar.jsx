import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, X } from "lucide-react";
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

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col h-full fixed md:relative z-40">
      {/* Close button for mobile */}
      <div className="md:hidden flex justify-end p-2">
        <button
          onClick={() => document.querySelector('.drawer-toggle').click()}
          className="btn btn-ghost btn-sm btn-circle"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="p-4 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="h-8 w-8 md:h-9 md:w-9 text-primary" />
          <span className="text-2xl md:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            TalkDude
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-y-auto">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${currentPath === "/"
            ? "bg-base-300 text-primary"
            : "text-base-content hover:bg-base-300/50"
            }`}
          onClick={() => window.innerWidth < 768 && document.querySelector('.drawer-toggle').click()}
        >
          <HomeIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm md:text-base">Home</span>
        </Link>

        <Link
          to="/friends"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${currentPath === "/friends"
            ? "bg-base-300 text-primary"
            : "text-base-content hover:bg-base-300/50"
            }`}
          onClick={() => window.innerWidth < 768 && document.querySelector('.drawer-toggle').click()}
        >
          <UsersIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm md:text-base">Friends</span>
          {incomingReqs.length > 0 && (
            <span className="badge badge-sm badge-primary absolute top-2 right-2 size-4 p-0.5 text-[10px]">
              {incomingReqs.length}
            </span>
          )}
        </Link>

        <Link
          to="/notifications"
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${currentPath === "/notifications"
            ? "bg-base-300 text-primary"
            : "text-base-content hover:bg-base-300/50"
            }`}
          onClick={() => window.innerWidth < 768 && document.querySelector('.drawer-toggle').click()}
        >
          <BellIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm md:text-base">Notifications</span>
          {totalNotifications > 0 && (
            <span className="badge badge-sm badge-primary absolute top-2 right-2 size-4 p-0.5 text-[10px]">
              {totalNotifications}
            </span>
          )}
        </Link>
      </nav>

      {/* User Profile */}
      <div className='p-3 border-t border-base-300 mt-auto'>
        {/* 🔥 CHANGED HERE: from /profile → /onboarding */}
        <Link to="/onboarding" className="block hover:bg-base-300/50 rounded-lg p-2 transition-colors">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden">
                <img
                  src={authUser?.profilePic || '/default-avatar.png'}
                  alt={authUser?.fullName || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{authUser?.fullName || 'User'}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
