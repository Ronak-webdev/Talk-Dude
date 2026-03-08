import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showNavbar = true, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden flex flex-col transition-colors duration-300">
      {/* Global Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {showNavbar && <Navbar toggleSidebar={toggleSidebar} />}

      <div className="flex-1 flex relative z-10 overflow-hidden">
        {showSidebar && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-sm transition-all animate-in fade-in duration-300"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto transition-all duration-500">
          <div className={`${showSidebar ? 'lg:pl-72' : ''} transition-all duration-500 h-full`}>
            <div className={`max-w-7xl mx-auto h-full ${showNavbar ? 'p-4 md:p-8' : 'p-0'}`}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

