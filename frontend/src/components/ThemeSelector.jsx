import { useThemeStore } from "../store/useThemeStore";
import { Check, Palette } from "lucide-react";

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk",
  "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe",
  "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee",
  "winter", "dim", "nord", "sunset",
];

const ThemeSelector = () => {
  const { theme: currentTheme, setTheme } = useThemeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="size-5 text-primary" />
        <h3 className="text-sm font-black text-base-content uppercase tracking-widest">Select Visual Theme</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {THEMES.map((t) => (
          <button
            key={t}
            className={`
              group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border
              ${currentTheme === t
                ? "bg-primary/10 border-primary/50"
                : "bg-base-300 border-base-content/5 hover:border-base-content/20"}
            `}
            onClick={() => setTheme(t)}
          >
            {/* Theme Preview */}
            <div className="relative h-10 w-full rounded-lg overflow-hidden border border-base-content/10 shadow-sm" data-theme={t}>
              <div className="absolute inset-0 bg-base-100">
                <div className="flex h-full w-full">
                  <div className="w-1/4 bg-primary"></div>
                  <div className="w-1/4 bg-secondary"></div>
                  <div className="w-1/4 bg-accent"></div>
                  <div className="w-1/4 bg-neutral"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[10px] font-black uppercase tracking-tighter truncate text-base-content/70 group-hover:text-base-content transition-colors">
                {t}
              </span>
              {currentTheme === t && (
                <Check className="size-3 text-primary stroke-[4px]" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
