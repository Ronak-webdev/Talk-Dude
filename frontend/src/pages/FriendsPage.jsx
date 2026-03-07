import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, unfriend } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { Users, Search } from "lucide-react";

const FriendsPage = () => {
  const queryClient = useQueryClient();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { mutate: unfriendMutation, isPending: isUnfriending } = useMutation({
    mutationFn: unfriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Your Network
          </h1>
          <p className="text-white/40 font-medium mt-1 italic">Connect and grow with your learning community</p>
        </div>

        <div className="flex items-center gap-3 glass-dark border border-white/5 p-2 rounded-2xl w-full md:w-80 group focus-within:border-blue-500/30 transition-all">
          <Search className="size-5 text-white/20 ml-2 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search connections..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full py-2"
          />
        </div>
      </div>

      {loadingFriends ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/5 animate-pulse" />
            <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin" />
          </div>
          <p className="text-white/40 font-bold uppercase tracking-[2px] text-xs">Loading Circle...</p>
        </div>
      ) : friends.length === 0 ? (
        <div className="glass-dark border border-white/5 rounded-[40px] p-20 flex flex-col items-center text-center">
          <div className="p-6 rounded-[32px] bg-blue-600/10 mb-6">
            <Users className="size-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No connections yet</h3>
          <p className="text-white/40 max-w-sm">Start exploring profiles to find mentors and language partners to join your learning journey.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {friends.map((friend) => (
            <FriendCard
              key={friend._id}
              friend={friend}
              onUnfriend={() => unfriendMutation(friend._id)}
              isUnfriending={isUnfriending}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;


