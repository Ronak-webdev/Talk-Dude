import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { acceptFriendRequest, declineFriendRequest, getFriendRequests } from "../lib/api";
import { Bell, Clock, Check, X, UserPlus, MessageSquare, AlertCircle } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: declineRequestMutation, isPending: isDeclining } = useMutation({
    mutationFn: declineFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];
  const declinedRequests = friendRequests?.declinedReqs || [];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
            Activity Center
          </h1>
          <p className="text-base-content/40 font-medium mt-1">Keep track of your latest interactions</p>
        </div>
        <div className="p-3 rounded-2xl glass-dark border border-base-content/5">
          <Bell className="size-6 text-blue-500" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="loading loading-spinner text-blue-500 loading-lg"></span>
          <p className="text-base-content/40 font-medium animate-pulse">Fetching your updates...</p>
        </div>
      ) : (
        <div className="grid gap-12">
          {incomingRequests.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <UserPlus className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-base-content/80">Friend Requests</h2>
                <span className="bg-blue-600/10 text-blue-500 text-xs font-bold px-2.5 py-1 rounded-lg">
                  {incomingRequests.length}
                </span>
              </div>

              <div className="grid gap-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="glass-dark border border-base-content/5 p-6 rounded-[28px] hover:border-blue-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] transition-transform group-hover:scale-105">
                            <div className="w-full h-full rounded-[14px] overflow-hidden bg-background">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-[#0a0a0a]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-base-content">{request.sender.fullName}</h3>
                          <div className="flex flex-wrap gap-2 mt-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                            <span className="px-2 py-1 glass rounded-lg border border-base-content/5">
                              {request.sender.nativeLanguage}
                            </span>
                            <span className="px-2 py-1 glass rounded-lg border border-base-content/5 text-blue-400">
                              → {request.sender.learningLanguage}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-base-content font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isPending || isDeclining}
                        >
                          <Check className="size-4" />
                          Accept
                        </button>
                        <button
                          className="px-6 py-2.5 glass hover:bg-white/10 text-base-content font-bold rounded-2xl border border-base-content/5 transition-all flex items-center gap-2"
                          onClick={() => declineRequestMutation(request._id)}
                          disabled={isPending || isDeclining}
                        >
                          <X className="size-4" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {acceptedRequests.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <Clock className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-bold text-base-content/80">Recent Connections</h2>
              </div>

              <div className="grid gap-3">
                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="glass-dark border border-base-content/5 p-5 rounded-[24px] group hover:bg-base-content/[0.04] transition-all cursor-pointer active:scale-[0.98]"
                    onClick={() => navigate(`/chat/${notification.recipient._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden glass border border-base-content/10 p-0.5">
                          <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} className="w-full h-full object-cover rounded-[10px]" />
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-base-content">
                            {notification.recipient.fullName} <span className="text-base-content/40 font-normal ml-1">joined your circle</span>
                          </p>
                          <p className="text-[11px] font-medium text-base-content/20 mt-1 uppercase tracking-wider">Recently</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-base-content transition-all">
                        <MessageSquare className="size-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {declinedRequests.length > 0 && declinedRequests.length < 5 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <AlertCircle className="h-5 w-5 text-red-500/50" />
                <h2 className="text-xl font-bold text-base-content/40">Passed Connections</h2>
              </div>

              <div className="grid gap-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {declinedRequests.map((notification) => (
                  <div key={notification._id} className="glass-dark border border-base-content/5 p-4 rounded-[24px]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden glass border border-base-content/10 opacity-50">
                        <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-base-content/50">
                        {notification.recipient.fullName} declined the invitation
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {incomingRequests.length === 0 &&
            acceptedRequests.length === 0 &&
            declinedRequests.length === 0 && <NoNotificationsFound />}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

