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
    <div className="group bg-base-200 rounded-[40px] border border-base-content/5 hover:border-primary/30 transition-all duration-500 shadow-2xl overflow-hidden relative">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />

      <div className="p-6 sm:p-8 relative z-10">
        {/* Header - Profile Info */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="size-16 sm:size-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] shadow-xl group-hover:rotate-3 transition-transform duration-500">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-base-100">
                  <img
                    src={friend.profilePic || `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`}
                    alt={friend.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 sm:size-6 bg-success border-[3px] border-base-200 rounded-full shadow-lg" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-black text-base-content uppercase tracking-tighter truncate leading-none">
                {friend.fullName}
              </h3>
              <p className="text-[10px] sm:text-xs font-black text-base-content/20 uppercase tracking-[0.2em] mt-2 truncate">
                Language Partner
              </p>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={handleMenuClick}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all border border-white/5 active:scale-90"
            >
              <MoreVertical className="size-5 sm:size-6" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-4 w-48 bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl z-20 animate-in zoom-in-95 duration-200">
                <button
                  onClick={handleUnfriend}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-xs font-black text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest"
                  disabled={isUnfriending}
                >
                  <Trash2 className="size-4" />
                  {isUnfriending ? 'Removing...' : 'Unfriend'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
          <div className="bg-white/[0.03] rounded-2xl p-3 sm:p-4 border border-white/5 group-hover:bg-white/[0.05] transition-colors">
            <p className="text-[10px] font-black text-white/15 uppercase tracking-widest mb-2 truncate">Native</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 rounded bg-[#030409]">
                {getLanguageFlag(friend.nativeLanguage)}
              </div>
              <span className="text-[12px] sm:text-sm font-black text-white uppercase tracking-tighter truncate leading-tight">
                {friend.nativeLanguage}
              </span>
            </div>
          </div>
          <div className="bg-white/[0.03] rounded-2xl p-3 sm:p-4 border border-white/5 group-hover:bg-white/[0.05] transition-colors">
            <p className="text-[10px] font-black text-white/15 uppercase tracking-widest mb-2 truncate">Learning</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1 rounded bg-[#030409]">
                {getLanguageFlag(friend.learningLanguage)}
              </div>
              <span className="text-[12px] sm:text-sm font-black text-blue-500 uppercase tracking-tighter truncate leading-tight">
                {friend.learningLanguage}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/chat/${friend._id}`}
          className="btn-premium w-full flex items-center justify-center gap-3 active:scale-95 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-shadow"
        >
          <MessageSquare className="size-5" />
          QUICK CHAT
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

