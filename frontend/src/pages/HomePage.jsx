import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import {
  cancelFriendRequest,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  XCircleIcon,
  Sparkles,
  Search,
  Users,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { capitialize } from "../lib/utils";
import { getLanguageFlag } from "../components/FriendCard";

const HomePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    enabled: !!authUser,
  });

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    enabled: !!authUser,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutate: cancelRequestMutation, isPending: isCancelling } =
    useMutation({
      mutationFn: cancelFriendRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && Array.isArray(outgoingFriendReqs) && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient?._id) {
          outgoingIds.add(req.recipient._id);
        }
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-base-100 pb-20 overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/30 via-purple-600/10 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 sm:px-12 max-w-7xl mx-auto text-center">
        <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-500 font-bold text-xs uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="size-4" />
            Global Community
          </div>

          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-base-content leading-tight animate-in fade-in zoom-in duration-700">
            MASTER<br />
            <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">NEW LANGUAGES.</span>
          </h1>

          <p className="text-lg sm:text-2xl text-base-content/50 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700">
            Connect with learners worldwide and elevate your conversations through authentic daily interaction.
          </p>

          <div className="relative max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 p-2 bg-base-200 border border-base-content/10 rounded-[2rem] shadow-2xl focus-within:border-blue-500/50 transition-all">
              <div className="flex-1 flex items-center px-6">
                <Search className="size-6 text-base-content/30 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by language or location..."
                  className="w-full bg-transparent px-4 py-4 text-base-content text-lg outline-none placeholder:text-base-content/20"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-base-content px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-32">
        {/* Outgoing Requests */}
        {(outgoingFriendReqs?.length > 0) && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl font-black text-base-content uppercase tracking-tighter italic">Pending Requests</h2>
              <div className="h-px flex-1 bg-base-content/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outgoingFriendReqs.map((req) => (
                <div key={req._id} className="card-vibrant p-6">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img src={req.recipient.profilePic} className="size-20 rounded-2xl object-cover ring-4 ring-blue-600/10" alt="" />
                      <div className="absolute -top-2 -right-2 bg-blue-600 p-1.5 rounded-lg shadow-lg">
                        <Users className="size-3 text-base-content" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-xl text-base-content truncate">{req.recipient.fullName}</h3>
                      <p className="text-sm font-bold text-base-content/30 uppercase tracking-widest">Sent Recently</p>
                    </div>
                  </div>
                  <button
                    className="w-full mt-6 py-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-base-content font-black uppercase tracking-widest text-xs transition-all border border-red-500/20"
                    onClick={() => cancelRequestMutation(req._id)}
                    disabled={isCancelling}
                  >
                    Cancel Request
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Users */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="inline-block px-4 py-1.5 rounded-lg bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
                Discover Learners
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-base-content tracking-tighter italic">Meet Your Next Partner</h2>
            </div>
            <Link to="/community" className="group flex items-center gap-3 text-sm font-bold text-base-content/40 hover:text-base-content transition-colors">
              VIEW ALL <div className="h-px w-12 bg-base-content/20 group-hover:w-20 group-hover:bg-blue-600 transition-all" />
            </Link>
          </div>

          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="size-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-base-content/20 font-black text-sm uppercase tracking-widest animate-pulse">Scanning Universe...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers?.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id} className="card-vibrant group flex flex-col h-full hover:border-blue-500 overflow-hidden">
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img src={user.profilePic} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/50 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="font-black text-2xl text-base-content uppercase tracking-tighter leading-none">{user.fullName}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPinIcon className="size-3 text-blue-500" />
                          <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">{user.location || "Global"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-8 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-2">
                        <div className="px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-600/20 text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="text-sm">{getLanguageFlag(user.nativeLanguage)}</span> {user.nativeLanguage}
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-base-content/5 border border-base-content/10 text-[10px] font-black text-base-content/40 uppercase tracking-widest flex items-center gap-2">
                          <span className="text-sm">{getLanguageFlag(user.learningLanguage)}</span> {user.learningLanguage}
                        </div>
                      </div>

                      {user.bio && (
                        <p className="text-sm text-base-content/50 leading-relaxed font-medium line-clamp-2 italic">
                          "{user.bio}"
                        </p>
                      )}

                      <div className="pt-8 mt-auto">
                        <button
                          className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 ${hasRequestBeenSent
                            ? "bg-base-content/5 text-base-content/20 cursor-not-allowed"
                            : "btn-premium"
                            }`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? <CheckCircle2 className="size-5 text-blue-500" /> : <UserPlus className="size-5" />}
                          {hasRequestBeenSent ? "REQUESTED" : "CONNECT"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

