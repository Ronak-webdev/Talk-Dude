import { useSignIn } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useLogin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: async ({ email, password }) => {
      if (!isLoaded) return;

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }
    },
    onSuccess: () => {
      toast.success("Welcome back!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const loginWithSocial = async (strategy) => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      toast.error(err.message || "Social login failed");
    }
  };

  return { isPending, error, loginMutation, loginWithSocial };
};

export default useLogin;
