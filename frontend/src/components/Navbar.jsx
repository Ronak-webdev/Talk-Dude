import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Menu, MessageSquare, Settings, X } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { useChatContext } from "../context/ChatContext";
import { useState } from "react";

const Navbar = ({ toggleSidebar }) => {
  const { authUser } = useAuthUser();
  const { executeLogout } = useLogout();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", title: "Home", icon: <MessageSquare className="size-5" /> },
    { path: "/friends", title: "Friends", icon: <MessageSquare className="size-5" /> },
    { path: "/notifications", title: "Notifications", icon: <BellIcon className="size-5" /> },
  ];

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
  });

  const { unreadCount } = useChatContext();

  const incomingReqs = friendRequests?.incomingReqs || [];
  const totalNotifications = incomingReqs.length + (unreadCount || 0);

  return (
    <nav className="bg-base-100/80 border-none sticky top-0 z-50 h-20 flex items-center px-4 sm:px-8 transition-all duration-300 backdrop-blur-xl lg:ml-72">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Menu button and Brand */}
        <div className="flex items-center gap-6">
          <button
            className="p-2 transition-all hover:bg-base-content/5 rounded-xl md:hidden active:scale-90"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-base-content/80" />
          </button>

          <Link to="/" className="flex items-center gap-3 group px-2 py-1 rounded-2xl hover:bg-base-content/5 transition-all lg:hidden">
            <div className="bg-gradient-to-tr from-primary to-secondary p-2.5 rounded-2xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <MessageSquare className="h-6 w-6 text-primary-content stroke-[2.5px]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-base-content hidden sm:block">
              TalkDude
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-base-200 p-1 rounded-2xl border border-base-content/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${location.pathname === link.path
                ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                : "text-base-content/60 hover:text-base-content"
                }`}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </div>

        {/* Right: User Profile / Mobile Actions */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              {/* Notifications */}
              <Link to="/notifications" className="relative p-2.5 hover:bg-base-content/5 rounded-xl text-base-content/60 hover:text-base-content transition-all">
                <BellIcon className="size-6" />
                {totalNotifications > 0 && (
                  <span className="absolute top-2 right-2 size-2.5 bg-error border-2 border-base-100 rounded-full" />
                )}
              </Link>

              {/* Desktop User Dropdown (Hidden on large screens because Sidebar is visible) */}
              <div className="hidden sm:block lg:hidden dropdown dropdown-end">
                <label tabIndex={0} className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-base-content/10 border border-transparent hover:border-base-content/10 cursor-pointer transition-all backdrop-blur-sm bg-base-200/50">
                  <img src={authUser.profilePic} className="size-10 rounded-xl object-cover ring-2 ring-primary/20" alt="" />
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-black text-base-content leading-none">{authUser.username || authUser.fullName.split(" ")[0]}</p>
                    <p className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest mt-1">Learner</p>
                  </div>
                </label>
                <div tabIndex={0} className="dropdown-content mt-4 w-64 bg-base-200/95 backdrop-blur-xl border border-base-content/10 rounded-3xl shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in duration-200">
                  <Link to="/onboarding" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-base-300 text-base-content/70 hover:text-base-content transition-all group border border-base-content/5">
                    <div className="bg-primary/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
                      <Settings className="size-5 text-primary" />
                    </div>
                    <span className="font-bold">Settings</span>
                  </Link>
                  <div className="h-px bg-base-content/5 mx-2" />
                  <button onClick={() => executeLogout()} className="btn-danger w-full">
                    <LogOutIcon className="size-5" />
                    SIGN OUT
                  </button>
                </div>
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="sm:hidden p-2 rounded-xl bg-base-content/5 text-base-content"
              >
                <img src={authUser.profilePic} className="size-8 rounded-lg object-cover" alt="" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-premium">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-base-200 flex flex-col animate-in fade-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between p-6 border-b border-base-content/10 bg-base-300">
            <span className="text-xl font-black text-base-content tracking-widest">MENU</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-base-content/10 text-base-content hover:bg-base-content/20 transition-all">
              <X className="size-6" />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-6 rounded-3xl bg-base-100 border border-base-content/5 text-base-content text-xl font-black uppercase tracking-tighter hover:bg-primary hover:text-primary-content transition-all shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {link.icon}
                  {link.title}
                </div>
                <div className="size-2 rounded-full bg-primary" />
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-base-content/10 bg-base-300 space-y-3">
            <div className="rotating-border-glow shadow-xl">
              <div className="flex items-center gap-3 p-3 rounded-[22px] w-full relative z-10">
                <img src={authUser?.profilePic} className="size-12 rounded-xl object-cover ring-2 ring-primary/30 flex-shrink-0" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-black text-base-content truncate leading-tight">{authUser?.fullName}</p>
                  <p className="text-xs text-base-content/60 font-medium truncate mt-0.5">{authUser?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                executeLogout();
              }}
              className="btn-danger w-full py-4 text-lg"
            >
              <LogOutIcon className="size-5" />
              SIGN OUT
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
