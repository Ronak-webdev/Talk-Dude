import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { Loader2, MapPin, Shuffle, Camera, ChevronRight, User } from "lucide-react";
import { LANGUAGES } from "../constants";
import ThemeSelector from "../components/ThemeSelector";

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
      toast.success("Profile updated successfully");
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
    <div className="min-h-screen bg-base-100 relative overflow-y-auto flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-20 transition-colors">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="card-vibrant bg-base-200/50 backdrop-blur-xl border border-base-content/10 rounded-[40px] shadow-2xl overflow-hidden">

          <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-2 min-h-[600px]">

            {/* Left Section: Profile Identity */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-base-content/5 flex flex-col justify-center bg-base-300/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <User className="size-6" />
                </div>
                <h1 className="text-2xl font-black text-base-content uppercase tracking-tighter">Identity Settings</h1>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-6 mb-8 mt-2">
                <div className="relative group">
                  <div
                    className="size-36 rounded-[32px] overflow-hidden relative cursor-pointer border-4 border-base-100 shadow-2xl ring-2 ring-primary/20 hover:ring-primary transition-all duration-500"
                    onClick={handleImageClick}
                  >
                    {formState.profilePic ? (
                      <img src={formState.profilePic} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-base-content/5">
                        <Camera className="size-10 text-base-content/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <Camera className="size-8 text-white" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-primary text-primary-content shadow-xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <Shuffle className="size-5" />
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="w-full bg-base-100 border border-base-content/10 focus:border-primary/30 rounded-2xl px-5 py-4 text-base-content font-bold outline-none transition-all placeholder:text-base-content/20"
                    placeholder="e.g. Alexander Pierce"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1">Bio & Status</label>
                  <textarea
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="w-full bg-base-100 border border-base-content/10 focus:border-primary/30 rounded-2xl px-5 py-4 text-base-content font-medium outline-none transition-all placeholder:text-base-content/20 h-24 resize-none"
                    placeholder="Tell us about yourself..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Section: Preferences & Themes */}
            <div className="flex flex-col h-full bg-base-200/50">
              <div className="flex-1 p-8 lg:p-12">
                <div className="space-y-8">

                  {/* Languages & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1">Native tongue</label>
                      <select
                        value={formState.nativeLanguage}
                        onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                        className="w-full bg-base-100 border border-base-content/10 focus:border-primary/30 rounded-2xl px-5 py-4 text-base-content font-bold outline-none appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Native</option>
                        {LANGUAGES.map((lang) => (
                          <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1">Target Language</label>
                      <select
                        value={formState.learningLanguage}
                        onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                        className="w-full bg-base-100 border border-base-content/10 focus:border-primary/30 rounded-2xl px-5 py-4 text-base-content font-bold outline-none appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Target</option>
                        {LANGUAGES.map((lang) => (
                          <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-base-content/40 uppercase tracking-widest ml-1">Global Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-primary" />
                      <input
                        type="text"
                        value={formState.location}
                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                        className="w-full bg-base-100 border border-base-content/10 focus:border-primary/30 rounded-2xl pl-12 pr-5 py-4 text-base-content font-bold outline-none transition-all placeholder:text-base-content/20"
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>

                  {/* Visual Theme Selection */}
                  <div className="pt-8 border-t border-base-content/5">
                    <ThemeSelector />
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-8 lg:p-12 pt-0 bg-base-200/50">
                <button
                  className="w-full group relative flex items-center justify-center gap-3 py-5 bg-primary text-primary-content font-black uppercase tracking-widest rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin size-5" />
                  ) : (
                    <>
                      Save Profile & Enter
                      <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
