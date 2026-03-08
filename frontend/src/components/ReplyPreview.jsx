import { X } from "lucide-react";

const ReplyPreview = ({ replyingTo, onCancel }) => {
  if (!replyingTo) return null;

  return (
    <div className="bg-base-300/90 backdrop-blur-xl border-t border-base-content/10 p-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-5xl mx-auto flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-blue-500 rounded-full" />
            <p className="text-xs font-black text-blue-500 uppercase tracking-widest">
              Replying to {replyingTo.userName}
            </p>
          </div>
          <p className="text-sm text-base-content/60 line-clamp-2 break-words">
            {replyingTo.text}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-xl hover:bg-base-content/5 text-base-content/40 hover:text-base-content transition-all flex-shrink-0"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ReplyPreview;
