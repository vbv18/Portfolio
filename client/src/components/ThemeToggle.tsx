import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Tooltip } from "@/components/ui/tooltip";

const order = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : SunMoon;

  return (
    <Tooltip content={`Theme: ${theme}`}>
      <button
        type="button"
        onClick={nextTheme}
        aria-label={`Switch theme, currently ${theme}`}
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink transition-colors hover:border-accent hover:text-accent cursor-pointer"
      >
        <Icon size={16} strokeWidth={1.75} />
      </button>
    </Tooltip>
  );
}
