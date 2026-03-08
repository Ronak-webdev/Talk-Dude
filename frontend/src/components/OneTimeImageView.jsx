import { useState, useEffect, useRef } from "react";
import { Eye, AlertTriangle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const OneTimeImageView = ({ imageUrl, onMarkAsViewed, isSender }) => {
  const [isViewing, setIsViewing] = useState(false);
  const [screenshotDetected, setScreenshotDetected] = useState(false);
  const viewCountRef = useRef(0);
  const visibilityHiddenRef = useRef(false);

  useEffect(() => {
    // Screenshot detection using Visibility API and blur events
    const handleVisibilityChange = () => {
      if (document.hidden && isViewing) {
        visibilityHiddenRef.current = true;
        // User might be taking a screenshot or switching tabs
        console.log("Visibility changed during viewing");
      }
    };

    const handleBeforeUnload = () => {
      if (isViewing) {
        // User trying to close during viewing
        notifyScreenshot();
      }
    };

    const handleBlur = () => {
      if (isViewing) {
        visibilityHiddenRef.current = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isViewing]);

  const notifyScreenshot = () => {
    if (!screenshotDetected) {
      setScreenshotDetected(true);
      toast.error("Screenshot attempt detected!", {
        duration: 3000,
        icon: <AlertTriangle className="size-5 text-red-500" />,
      });

      // Notify sender (in real app, this would call an API)
      console.log("Screenshot attempt - notifying sender");
    }
  };

  const handleStartViewing = () => {
    if (viewCountRef.current === 0) {
      setIsViewing(true);
      viewCountRef.current = 1;

      // Auto-hide after 10 seconds
      setTimeout(() => {
        finishViewing();
      }, 10000);
    }
  };

  const finishViewing = () => {
    setIsViewing(false);
    onMarkAsViewed();
    toast.success("Image viewed and will be removed from chat", {
      duration: 2000,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "PrintScreen" || e.key === "PrtSc") {
      notifyScreenshot();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent right-click on the image
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  if (isViewing) {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-none"
        onClick={finishViewing}
      >
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt="One-time view"
            className="w-full h-full object-contain pointer-events-none"
            onContextMenu={handleContextMenu}
            draggable="false"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-base-content/10">
            <Clock className="size-5 text-base-content/60 animate-pulse" />
            <span className="text-base-content/80 font-bold text-sm">
              Click anywhere to close • Auto-closes in 10s
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleStartViewing}
        className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-4 hover:border-purple-500/50 transition-all duration-500 group/btn"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Eye className="size-8 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-black text-white text-sm uppercase tracking-wider mb-1">
              One-Time View Photo
            </h4>
            <p className="text-xs text-base-content/40 font-medium">
              {isSender ? "This photo will disappear after viewing" : "You can view this photo once"}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">
                VIEW ONCE
              </span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default OneTimeImageView;
