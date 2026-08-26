import { motion } from "framer-motion";
import { Terminal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function TerminalLauncher({ isOpen, onToggle }: TerminalLauncherProps) {
  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label={
          isOpen ? "Close AI Terminal Assistant" : "Open AI Terminal Assistant"
        }
        aria-expanded={isOpen}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-full border px-4 py-2.5 shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer select-none",
          isOpen
            ? "border-accent bg-surface text-ink shadow-accent/10"
            : "border-border bg-surface/95 text-ink hover:border-ink/50 dark:hover:border-accent/60 hover:shadow-xl",
        )}
      >
        {/* Animated Live Status Ping Dot */}
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              isOpen ? "bg-accent animate-ping" : "bg-circuit animate-ping",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              isOpen ? "bg-accent" : "bg-circuit",
            )}
          />
        </span>

        {/* Terminal Icon & Text */}
        <div className="flex items-center gap-1.5 font-mono text-[12.5px] font-medium tracking-tight">
          <Terminal
            size={14}
            className={isOpen ? "text-accent" : "text-circuit"}
          />
          <span className="text-ink group-hover:text-accent transition-colors">
            {isOpen ? "close_term.sh" : "ask_ai.sh"}
          </span>
        </div>

        {/* Subtle AI Sparkle Pill */}
        <span className="hidden xs:inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted">
          <Sparkles size={10} className="text-accent" />
          <span>Gemini</span>
        </span>
      </motion.button>
    </div>
  );
}
