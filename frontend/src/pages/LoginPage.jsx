import { useState } from "react";
import { MessageSquare, Mail, Lock, LogIn, Chrome } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation, loginWithSocial } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden bg-background">
        <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Logo & Header */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-3 group">
              <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-4 rounded-3xl shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-foreground/50">Continue your language journey with TalkDude</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
              {error.response?.data?.message || error.message || "Invalid credentials. Please try again."}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-foreground/40 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl glass-dark border border-white/5 focus:border-blue-500/50 transition-all outline-none"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground/40 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl glass-dark border border-white/5 focus:border-blue-500/50 transition-all outline-none"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full btn-premium flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-background px-4 text-foreground/30 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center relative z-20">
              <button
                onClick={() => loginWithSocial("oauth_google")}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl glass-dark border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all duration-200 group/btn shadow-xl shadow-blue-500/5"
              >
                <Chrome className="h-6 w-6 text-[#4285F4] transition-transform group-hover/btn:scale-110" />
                <span className="font-semibold text-lg">Continue with Google</span>
              </button>
            </div>
          </div>

          <p className="text-center text-foreground/50">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-semibold underline-offset-4 hover:underline transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="hidden lg:flex flex-col justify-center items-center glass-dark relative overflow-hidden border-l border-white/5">
        <div className="max-w-lg p-12 text-center space-y-8 relative z-10 animate-in fade-in zoom-in duration-1000">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700" />
            <img src="/i.png" alt="Visual" className="relative w-80 h-80 object-contain drop-shadow-2xl floating" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Connect and Learn together</h2>
            <p className="text-foreground/60 leading-relaxed">
              Join a community of millions learning languages through real conversations.
              Experience the most natural way to master any language.
            </p>
          </div>
        </div>

        {/* Animated dots grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>
    </div>
  );
};

export default LoginPage;