import { Link } from "react-router-dom";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MoreVertical, MessageSquare, Trash2 } from "lucide-react";
import { useState } from "react";

const FriendCard = ({ friend, onUnfriend, isUnfriending }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const handleUnfriend = (e) => {
    e.preventDefault();
    setShowMenu(false);
    onUnfriend();
  };

  return (
    <div className="glass-dark border border-white/5 rounded-[28px] overflow-hidden group hover:border-blue-500/30 transition-all duration-500 shadow-xl hover:shadow-blue-500/5">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-background">
                  <img src={friend.profilePic} alt={friend.fullName} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-[#0a0a0a]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{friend.fullName}</h3>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest mt-1 italic">Professional Mentor</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={handleMenuClick}
              className="p-2 rounded-xl glass hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-dark border border-white/10 rounded-2xl shadow-2xl z-20 animate-in zoom-in-95 duration-200">
                <div className="p-2">
                  <button
                    onClick={handleUnfriend}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
                    disabled={isUnfriending}
                  >
                    <Trash2 className="size-4" />
                    {isUnfriending ? 'Removing...' : 'Remove Friend'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats/Languages */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass bg-white/5 rounded-xl p-3 border border-white/5 group/stat">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Native</p>
            <div className="flex items-center gap-2">
              {getLanguageFlag(friend.nativeLanguage)}
              <span className="text-sm font-bold text-white/80">{friend.nativeLanguage}</span>
            </div>
          </div>
          <div className="glass bg-white/5 rounded-xl p-3 border border-white/5 group/stat">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Learning</p>
            <div className="flex items-center gap-2">
              {getLanguageFlag(friend.learningLanguage)}
              <span className="text-sm font-bold text-blue-400">{friend.learningLanguage}</span>
            </div>
          </div>
        </div>

        <Link to={`/chat/${friend._id}`} className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <MessageSquare className="size-4" />
          Quick Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3.5 rounded-sm"
      />
    );
  }
  return null;
}

