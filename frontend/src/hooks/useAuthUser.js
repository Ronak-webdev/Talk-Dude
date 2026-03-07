import { useUser, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser, setAuthToken } from "../lib/api";
import { useEffect } from "react";

const useAuthUser = () => {
  const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();

  const authUserQuery = useQuery({
    queryKey: ["authUser", clerkUser?.id],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      return getAuthUser();
    },
    enabled: isClerkLoaded && isSignedIn,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handle loading state
  const isLoading = !isClerkLoaded || (isSignedIn && authUserQuery.isLoading);

  return {
    isLoading,
    authUser: authUserQuery.data,
    clerkUser
  };
};

export default useAuthUser;
