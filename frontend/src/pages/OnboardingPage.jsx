import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { Loader2, MapPin, MessageSquare, Shuffle, Camera, ChevronRight, User } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  useEffect(() => {
    if (!formState.profilePic && !authUser?.profilePic) {
      const idx = Math.floor(Math.random() * 1000) + 1;
      const initialAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`;
      setFormState((prev) => ({ ...prev, profilePic: initialAvatar }));
    }
  }, [authUser?.profilePic, formState.profilePic]);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (data) => {
      toast.success("Profile onboarded successfully");
      queryClient.setQueryData(["authUser"], data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 1000) + 1;
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState({ ...formState, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="glass-dark border border-white/5 rounded-[40px] shadow-2xl overflow-hidden grid md:grid-cols-[380px,1fr]">

          {/* Sidebar Info */}
          <div className="bg-gradient-to-b from-blue-600 to-purple-700 p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />

            <div className="relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl w-fit mb-6">
                <User className="size-8" />
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-4">Set Up Your Professional Profile</h2>
              <p className="text-white/70 font-medium text-sm leading-relaxed">
                Join a global network of professionals and language learners. Customize your identity to stand out in the community.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 glass bg-white/10 p-3 rounded-2xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Real-time collaboration</span>
              </div>
              <div className="flex items-center gap-3 glass bg-white/10 p-3 rounded-2xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Premium networking</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-12">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <span className="md:hidden p-2 rounded-lg bg-blue-600/10 text-blue-500 mr-1">
                <User className="size-5" />
              </span>
              Personalize Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Pic */}
              <div className="flex flex-col items-center sm:flex-row gap-6 mb-10">
                <div className="relative group">
                  <div
                    className="size-32 rounded-3xl overflow-hidden relative cursor-pointer border-2 border-white/10 hover:border-blue-500/50 transition-all duration-500 shadow-2xl"
                    onClick={handleImageClick}
                  >
                    {formState.profilePic ? (
                      <img src={formState.profilePic} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-white/5">
                        <Camera className="size-10 text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <Camera className="size-8 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-500 transition-all hover:scale-110 active:scale-90"
                    title="Shuffle Profile"
                  >
                    <Shuffle className="size-4" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-white font-bold mb-1">Display Avatar</h3>
                  <p className="text-white/30 text-xs leading-relaxed max-w-[200px]">Click to upload or use our shuffle feature to generate a professional avatar.</p>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="grid gap-5">
                  <div className="relative group">
                    <label className="text-[11px] font-bold text-white/30 uppercase tracking-[2px] ml-1 mb-2 block">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formState.fullName}
                      onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-blue-500/30 rounded-2xl px-5 py-4 text-white outline-none transition-all placeholder:text-white/10"
                      placeholder="e.g. Alexander Pierce"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <label className="text-[11px] font-bold text-white/30 uppercase tracking-[2px] ml-1 mb-2 block">Professional Bio</label>
                    <textarea
                      name="bio"
                      value={formState.bio}
                      onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-blue-500/30 rounded-2xl px-5 py-4 text-white outline-none transition-all placeholder:text-white/10 resize-none h-28"
                      placeholder="Briefly describe your expertise and learning interests..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative group">
                    <label className="text-[11px] font-bold text-white/30 uppercase tracking-[2px] ml-1 mb-2 block">Native Tongue</label>
                    <select
                      name="nativeLanguage"
                      value={formState.nativeLanguage}
                      onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-blue-500/30 rounded-2xl px-5 py-4 text-white outline-none transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-background">Select Native</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`native-${lang}`} value={lang.toLowerCase()} className="bg-background">{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative group">
                    <label className="text-[11px] font-bold text-white/30 uppercase tracking-[2px] ml-1 mb-2 block">Target Language</label>
                    <select
                      name="learningLanguage"
                      value={formState.learningLanguage}
                      onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-blue-500/30 rounded-2xl px-5 py-4 text-white outline-none transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-background">Select Target</option>
                      {LANGUAGES.map((lang) => (
                        <option key={`learning-${lang}`} value={lang.toLowerCase()} className="bg-background">{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative group">
                  <label className="text-[11px] font-bold text-white/30 uppercase tracking-[2px] ml-1 mb-2 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-blue-500/50" />
                    <input
                      type="text"
                      name="location"
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-blue-500/30 rounded-2xl pl-12 pr-5 py-4 text-white outline-none transition-all placeholder:text-white/10"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                className="w-full group relative flex items-center justify-center gap-3 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <>
                    Complete Registration
                    <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

