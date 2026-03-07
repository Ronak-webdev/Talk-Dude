import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";
import { capitialize } from "../lib/utils";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
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
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Discover your next language partner
            </span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Conversations, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Elevating.</span>
          </h1>

          <p className="text-base sm:text-xl text-foreground/60 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Connect with learners worldwide and master languages through authentic daily interaction.
          </p>

          <div className="relative max-w-md mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-foreground/40" />
            </div>
            <input
              type="text"
              placeholder="Search by language or location..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-dark border border-white/10 focus:border-blue-500 transition-all outline-none text-white shadow-2xl"
            />
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full" />
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-16 pb-20">
        {/* Outgoing Requests */}
        {outgoingFriendReqs && outgoingFriendReqs.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              Pending Connections
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 border border-white/10">
                {outgoingFriendReqs.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {outgoingFriendReqs.map((req) => (
                <div key={req._id} className="glass-dark group hover:border-white/20 transition-all duration-300 rounded-3xl overflow-hidden shadow-xl">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-600 to-white/10">
                          <img src={req.recipient.profilePic} className="w-full h-full rounded-[14px] object-cover bg-neutral-900" alt="" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{req.recipient.fullName}</h3>
                        <p className="text-xs text-foreground/50">Request sent recently</p>
                      </div>
                    </div>
                    <button
                      className="w-full py-3 rounded-2xl bg-white/5 hover:bg-red-500/10 text-red-400 text-sm font-semibold transition-all border border-transparent hover:border-red-500/20 flex items-center justify-center gap-2"
                      onClick={() => cancelRequestMutation(req._id)}
                      disabled={isCancelling}
                    >
                      <XCircleIcon className="size-4" />
                      Cancel Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Users */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Meet New Learners</h2>
          </div>

          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <span className="loading loading-spinner loading-lg text-blue-500" />
              <p className="text-foreground/40 animate-pulse">Finding connections...</p>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="glass-dark p-12 text-center rounded-3xl border border-white/5">
              <h3 className="font-bold text-xl mb-4">No recommendations available</h3>
              <p className="text-foreground/50">Check back later for new language partners!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div key={user._id} className="glass-dark group hover:border-white/20 transition-all duration-500 rounded-3xl overflow-hidden shadow-2xl hover:-translate-y-2">
                    <div className="relative h-2 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-600 to-white/10">
                            <img src={user.profilePic} className="w-full h-full rounded-[14px] object-cover bg-neutral-900" alt="" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{user.fullName}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs text-foreground/50 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                          {getLanguageFlag(user.nativeLanguage)} Native: {user.nativeLanguage}
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                          {getLanguageFlag(user.learningLanguage)} Learning: {user.learningLanguage}
                        </div>
                      </div>

                      {user.bio && <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2">{user.bio}</p>}

                      <button
                        className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${hasRequestBeenSent
                          ? "bg-white/5 text-foreground/40 cursor-not-allowed border border-white/5"
                          : "btn-premium shadow-lg shadow-blue-500/20"
                          }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Connected
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            Send Request
                          </>
                        )}
                      </button>
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

