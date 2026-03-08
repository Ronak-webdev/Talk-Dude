import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { MessageSquare, Users, Globe, Settings, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { authUser } = useAuthUser();
  const { executeLogout } = useLogout();
  const location = useLocation();

  if (!authUser) return null;

  const menuItems = [
    { title: "Dashboard", path: "/", icon: <LayoutDashboard className="size-5" /> },
    { title: "Explore", path: "/community", icon: <Globe className="size-5" /> }, 
    { title: "Connections", path: "/friends", icon: <Users className="size-5" /> },
    { title: "Settings", path: "/onboarding", icon: <Settings className="size-5" /> },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 bg-base-200/98 backdrop-blur-xl border-r border-base-content/10 transition-transform duration-500 ease-in-out transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="flex flex-col h-full p-6 pt-24 lg:pt-8">
        {/* Brand Logo - Desktop Only */}
        <Link to="/" className="hidden lg:flex items-center gap-3 group px-2 py-1 rounded-2xl hover:bg-white/5 transition-all mb-8">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
            <MessageSquare className="h-6 w-6 text-white stroke-[2.5px]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-base-content">
            TalkDude
          </span>
        </Link>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-10 p-4 rounded-3xl bg-base-300/80 border border-base-content/10 backdrop-blur-sm">
          <div className="relative">
            <img
              src={authUser.profilePic}
              className="size-14 rounded-2xl object-cover ring-4 ring-blue-600/10"
              alt=""
            />
            <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 border-2 border-base-100 rounded-full" />
          </div>
          <div className="min-w-0">
            <h2 className="font-black text-base-content truncate leading-tight">{authUser.fullName}</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">Learner</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => toggleSidebar && toggleSidebar()}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${location.pathname === item.path
                ? "bg-primary text-primary-content shadow-xl shadow-primary/20"
                : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${location.pathname === item.path ? "text-primary-content" : "text-primary"} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="font-black uppercase tracking-tighter text-sm">{item.title}</span>
              </div>
              <ChevronRight className={`size-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${location.pathname === item.path ? "opacity-100" : ""}`} />
            </Link>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="pt-6 border-t border-base-content/5 mt-auto">
          <button
            onClick={() => {
              toggleSidebar && toggleSidebar();
              executeLogout();
            }}
            className="btn-danger w-full py-5 flex items-center justify-center gap-3 text-sm font-black tracking-widest"
          >
            <LogOut className="size-5" />
            SIGN OUT
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
