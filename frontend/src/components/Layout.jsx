import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Only auto-open sidebar on desktop
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up the event listener
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleClickOutside = () => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" onClick={handleClickOutside}>
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[140px]" />
      </div>

      <div className="drawer lg:drawer-open relative z-10">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isSidebarOpen}
          onChange={() => { }}
        />

        {/* Main Content */}
        <div className="drawer-content flex flex-col h-screen overflow-hidden">
          <Navbar
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent h-full">
            <div className="max-w-[1600px] mx-auto h-full">
              {children}
            </div>
          </main>
        </div>

        {/* Drawer Sidebar */}
        <div className="drawer-side z-50">
          <label
            htmlFor="my-drawer"
            className="drawer-overlay !bg-black/40"
            onClick={(e) => e.stopPropagation()}
          ></label>
          <div
            className="w-72 h-full relative bg-[#0f111a] border-r border-white/5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

