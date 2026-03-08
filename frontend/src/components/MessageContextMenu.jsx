import { useEffect, useRef } from "react";
import { Trash2, Trash, Reply, Eye, AlertTriangle } from "lucide-react";

const MessageContextMenu = ({
  isOpen,
  position,
  onClose,
  onDelete,
  onReply,
  onViewOnce,
  isOwnMessage,
  hasImage
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[200px] bg-base-200 border border-base-content/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="py-2">
        {isOwnMessage && (
          <>
            <button
              onClick={() => {
                onDelete("me");
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-base-content/70 hover:text-base-content hover:bg-base-content/5 transition-all group"
            >
              <Trash className="size-5 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Delete for Me</span>
            </button>
            <button
              onClick={() => {
                onDelete("everyone");
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-base-content/70 hover:text-base-content hover:bg-base-content/5 transition-all group"
            >
              <Trash2 className="size-5 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Delete for Everyone</span>
            </button>
            <div className="h-px bg-white/5 mx-2 my-1" />
          </>
        )}

        {!isOwnMessage && (
          <>
            <button
              onClick={() => {
                onReply();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-base-content/70 hover:text-base-content hover:bg-base-content/5 transition-all group"
            >
              <Reply className="size-5 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm">Reply</span>
            </button>
            <div className="h-px bg-white/5 mx-2 my-1" />
          </>
        )}

        {hasImage && (
          <button
            onClick={() => {
              onViewOnce();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-base-content/70 hover:text-base-content hover:bg-base-content/5 transition-all group"
          >
            <Eye className="size-5 text-purple-500 group-hover:scale-110 transition-transform" />
            <div className="flex-1">
              <span className="font-bold text-sm block">One-Time View</span>
              <span className="text-[10px] text-white/40 block">Photo disappears after viewing</span>
            </div>
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-base-content/40 hover:text-base-content hover:bg-base-content/5 transition-all"
        >
          <AlertTriangle className="size-4" />
          <span className="font-medium text-xs">Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default MessageContextMenu;
