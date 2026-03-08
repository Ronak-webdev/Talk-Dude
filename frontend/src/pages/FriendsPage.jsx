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
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-base-content/5">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-base-content mb-3">
            Your Circle
          </h1>
          <p className="text-base-content/40 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
            Connect and grow with your learning community
          </p>
        </div>

        <div className="w-full lg:w-[450px]">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-base-content/20 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, language or ID..."
              className="w-full bg-base-200 border border-base-content/5 focus:border-blue-500/30 rounded-3xl pl-14 pr-6 py-5 text-base-content outline-none transition-all placeholder:text-base-content/10 shadow-xl"
            />
          </div>
        </div>
      </div>

      {loadingFriends ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 bg-base-200/30 rounded-[48px] border border-dashed border-base-content/5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-[6px] border-base-content/5 animate-pulse" />
            <div className="absolute inset-0 border-t-[6px] border-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-base-content/20 font-black uppercase tracking-[0.3em] text-[10px] animate-bounce">
            Expanding your world...
          </p>
        </div>
      ) : friends.length === 0 ? (
        <div className="bg-gradient-to-b from-[#0f111a] to-transparent border border-base-content/10 rounded-[48px] p-12 sm:p-24 flex flex-col items-center text-center shadow-2xl">
          <div className="p-8 rounded-[40px] bg-blue-600/10 mb-10 ring-1 ring-blue-500/20 shadow-blue-500/10 shadow-2xl">
            <Users className="size-16 text-blue-500" />
          </div>
          <h3 className="text-3xl font-black text-base-content mb-4">Finding Your First Match</h3>
          <p className="text-base-content/30 max-w-sm font-medium leading-relaxed">
            Your learning circle is empty. Head to the <span className="text-blue-500">Explore</span> page to find your perfect language partner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-12">
          {friends.map((friend) => (
            <div key={friend._id} className="animate-in fade-in slide-in-from-bottom duration-500">
              <FriendCard
                friend={friend}
                onUnfriend={() => unfriendMutation(friend._id)}
                isUnfriending={isUnfriending}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;


