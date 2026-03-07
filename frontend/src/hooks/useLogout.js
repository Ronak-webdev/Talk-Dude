import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useClerk } from "@clerk/clerk-react";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { signOut } = useClerk();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await signOut();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
