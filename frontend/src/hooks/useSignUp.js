import { useSignUp } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useSignUpHook = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: async ({ email, password, fullName }) => {
      if (!isLoaded) return;

      const [firstName, ...lastNameParts] = fullName.split(" ");
      const lastName = lastNameParts.join(" ");

      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        return { status: "complete" };
      } else if (result.status === "missing_requirements") {
        // Handle missing requirements if any (e.g. email verification)
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        return { status: "verification_required" };
      }

      return result;
    },
    onSuccess: (result) => {
      if (result.status === "verification_required") {
        toast.success("Please check your email for verification code.");
        // In a real app we'd show a verification UI. 
        // For now, redirecting to login as Clerk will handle the flow there if session is incomplete.
        navigate("/login");
      } else {
        toast.success("Account created successfully!");
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/onboarding");
      }
    },
    onError: (err) => {
      const clerkError = err.clerkError ? err.errors?.[0]?.message : null;
      toast.error(clerkError || err.message || "Something went wrong");
    },
  });

  const signupWithSocial = async (strategy) => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      toast.error(err.message || "Social signup failed");
    }
  };

  return { isPending, error, signupMutation, signupWithSocial };
};

export default useSignUpHook;
