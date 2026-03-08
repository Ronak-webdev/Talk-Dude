import { MessageCircle } from "lucide-react";

const NewMessageIndicator = ({ count, onClick }) => {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 sm:bottom-28 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-8 z-30 
                 flex items-center gap-2 px-4 py-2.5 
                 bg-blue-600 hover:bg-blue-500 
                 text-white font-bold text-xs sm:text-sm 
                 rounded-full shadow-2xl shadow-blue-600/40 
                 border-2 border-white/20
                 animate-in fade-in slide-in-from-bottom-4 zoom-in duration-300
                 hover:scale-105 active:scale-95 transition-all
                 backdrop-blur-sm"
      aria-label={`Scroll to ${count} new message${count > 1 ? 's' : ''}`}
    >
      <MessageCircle className="size-4 sm:size-5" />
      <span>{count} New Message{count > 1 ? 's' : ''}</span>
    </button>
  );
};

export default NewMessageIndicator;
