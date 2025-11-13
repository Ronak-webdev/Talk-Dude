import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, Menu } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ toggleSidebar, isMobile = false }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-2 sm:px-4">
      <div className="w-full mx-auto flex items-center justify-between">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center">
          <button 
            className="btn btn-ghost btn-circle p-2 mr-1 md:hidden" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
        
          
          {/* Show logo in chat page on all devices */}
          {isChatPage && (
            <Link to="/" className="hidden md:flex items-center gap-2">
              <ShipWheelIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                TalkDude
              </span>
            </Link>
          )}
        </div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Notifications */}
          <Link to={"/notifications"} className="btn btn-ghost btn-circle p-2">
            <BellIcon className="h-5 w-5 text-base-content opacity-70" />
          </Link>
          
          {/* Theme Selector */}
          <div className="hidden sm:block">
            <ThemeSelector />
          </div>
          
          {/* User Avatar */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar p-0">
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
              <li>
                <button onClick={logoutMutation} className="flex items-center justify-between">
                  Logout
                  <LogOutIcon className="h-4 w-4" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
