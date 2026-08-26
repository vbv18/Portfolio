import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CornerDownLeft,
  Sparkles,
  AlertCircle,
  Terminal as TerminalIcon,
  Download,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { askTerminalAi, TerminalApiError } from "@/services/terminal";
import { TerminalMessage } from "./TerminalMessage";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { experience, education, achievements } from "@/data/history";
import { cn } from "@/lib/utils";

interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "What are Vaibhav's top projects?",
  "Tell me about his BEL internship.",
  "What is his full technical stack?",
  "What are his achievements and GATE rank?",
];

function getTimestamp() {
  const d = new Date();
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function createInitialWelcome(): MessageItem {
  return {
    id: `welcome-${Date.now()}`,
    role: "system",
    content: `**Vaibhav Garg Portfolio AI Terminal [v1.0.0]**
*Grounded in live portfolio data · Powered by Gemini*

Type a question below, click a quick prompt, or type \`help\` for terminal commands.`,
    timestamp: getTimestamp(),
  };
}

export function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    createInitialWelcome(),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus management, background scroll lock & escape listener
  useEffect(() => {
    if (isOpen) {
      lastActiveElementRef.current =
        document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 150);

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(t);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        lastActiveElementRef.current?.focus?.();
      };
    }
  }, [isOpen, onClose]);

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading, isOpen]);

  // Clear / Reset terminal buffer & abort pending requests
  const handleClear = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "system",
        content: `**Terminal buffer cleared.** Type a question or type \`help\` to explore.`,
        timestamp: getTimestamp(),
      },
    ]);
    setInput("");
    draftRef.current = "";
    setHistoryIndex(-1);
  }, []);

  const addAssistantMessage = (content: string, isError = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "assistant",
        content,
        timestamp: getTimestamp(),
        isError,
      },
    ]);
  };

  // Local commands execution
  const executeLocalCommand = (cmd: string): boolean => {
    const normalized = cmd.trim().toLowerCase();

    if (normalized === "clear" || normalized === "cls") {
      handleClear();
      return true;
    }

    if (normalized === "exit" || normalized === "quit" || normalized === "q") {
      onClose();
      return true;
    }

    if (normalized === "whoami") {
      addAssistantMessage(
        `**Session Identity**: \`guest@developer-terminal\`\n**Status**: Authorized Portfolio Visitor`,
      );
      return true;
    }

    if (normalized === "about" || normalized === "bio") {
      addAssistantMessage(`### About Vaibhav Garg:
**${profile.name}** — ${profile.role} (${profile.location})
${profile.tagline}

**Status:** ${profile.status}
**Degree:** ${profile.degree}, ${profile.institute}`);
      return true;
    }

    if (normalized === "resume") {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "Vaibhav_Garg_Resume.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addAssistantMessage(
        `Downloading Vaibhav Garg's resume ([/resume.pdf](/resume.pdf))...`,
      );
      return true;
    }

    if (normalized === "help") {
      addAssistantMessage(`### Available Terminal Commands & Navigation:
- \`projects\` — Display featured full-stack & AI projects
- \`skills\` — Overview of languages, frameworks, databases, and tools
- \`experience\` — Details of Bharat Electronics Limited (BEL) internship
- \`education\` — Academic records and degrees
- \`achievements\` — Honors, GATE rank, and hackathon milestones
- \`about\` — Summary profile and current status
- \`contact\` — Reach out directly to Vaibhav
- \`resume\` — Download verified PDF resume
- \`clear\` — Reset terminal output history (or \`Ctrl+L\`)
- \`exit\` — Close this terminal window (or \`Esc\`)

*Tip: You can also ask any free-form natural question (e.g. "How does Forge AI work?" or "Explain the authentication service architecture").*`);
      return true;
    }

    if (normalized === "projects") {
      const summary = projects
        .map((p, i) => {
          const links = [
            p.githubUrl ? `[GitHub Repository](${p.githubUrl})` : null,
            p.liveUrl ? `[Live Application](${p.liveUrl})` : null,
          ]
            .filter(Boolean)
            .join(" | ");

          return `**${i + 1}. ${p.title}** (\`${p.tech.slice(0, 5).join(", ")}\`)\n- ${p.overview}${
            links ? `\n- ${links}` : ""
          }`;
        })
        .join("\n\n");
      addAssistantMessage(`### Featured Projects:\n\n${summary}`);
      return true;
    }

    if (normalized === "skills") {
      const summary = skillCategories
        .map(
          (cat) =>
            `- **${cat.title}**: ${cat.items.map((it) => `\`${it}\``).join(", ")}`,
        )
        .join("\n");
      addAssistantMessage(`### Technical Skills Matrix:\n\n${summary}`);
      return true;
    }

    if (normalized === "experience") {
      const exp = experience
        .map(
          (e) =>
            `**${e.role}** at **${e.org}** (${e.period} · ${e.location})\n${e.points
              .map((pt) => `* ${pt}`)
              .join("\n")}`,
        )
        .join("\n\n");
      addAssistantMessage(`### Experience:\n\n${exp}`);
      return true;
    }

    if (normalized === "education") {
      const edu = education
        .map(
          (ed) =>
            `- **${ed.degree}** — ${ed.institute} (${ed.period}) — **Score: ${ed.score}**`,
        )
        .join("\n");
      addAssistantMessage(`### Academic Record:\n\n${edu}`);
      return true;
    }

    if (normalized === "achievements") {
      const ach = achievements
        .map((a) => `- **${a.title}**${a.detail ? ` (${a.detail})` : ""}`)
        .join("\n");
      addAssistantMessage(`### Honors & Achievements:\n\n${ach}`);
      return true;
    }

    if (normalized === "contact") {
      addAssistantMessage(`### Contact Information:
- **Email**: [${profile.email}](mailto:${profile.email})
- **LinkedIn**: [${profile.linkedinLabel}](${profile.linkedin})
- **GitHub**: [${profile.githubLabel}](${profile.github})
- **Location**: ${profile.location}`);
      return true;
    }

    return false;
  };

  // Submit query
  const handleSubmit = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    // Record user command
    const userMsg: MessageItem = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: trimmed,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setCommandHistory((prev) =>
      [trimmed, ...prev.filter((c) => c !== trimmed)].slice(0, 30),
    );
    setHistoryIndex(-1);
    setInput("");
    draftRef.current = "";

    // Check if it's a local command
    if (executeLocalCommand(trimmed)) {
      return;
    }

    // Call Gemini API server endpoint
    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Build conversation history payload (only successful turns, max 6, no error messages)
      const validHistory = messages
        .filter(
          (m) => (m.role === "user" || m.role === "assistant") && !m.isError,
        )
        .slice(-6)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      // Ensure first item in history is a 'user' turn for Gemini API compliance
      const sanitizedHistory =
        validHistory.length > 0 && validHistory[0]?.role === "assistant"
          ? validHistory.slice(1)
          : validHistory;

      const res = await askTerminalAi(trimmed, sanitizedHistory);
      addAssistantMessage(res.reply);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      const message =
        err instanceof TerminalApiError
          ? err.message
          : "An unexpected error occurred. Please try again.";
      addAssistantMessage(`[ERROR]: ${message}`, true);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  // Up/Down arrow key history navigation & Ctrl+L clear
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex === -1) {
          draftRef.current = input;
        }
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(commandHistory[prevIndex] ?? "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput(draftRef.current);
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile & desktop click-outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] sm:bg-black/20"
          />

          {/* Terminal Window */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="AI Portfolio Terminal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden border border-border bg-surface shadow-2xl transition-[width,height] duration-200",
              // Mobile styles: bottom sheet
              "inset-x-0 bottom-0 h-[86dvh] max-h-[86dvh] rounded-t-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:rounded-md",
              isMaximized
                ? "sm:h-[85vh] sm:w-[720px]"
                : "sm:h-[580px] sm:max-h-[calc(100vh-5rem)] sm:w-[540px]",
            )}
          >
            {/* Terminal Window Header Bar */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-surface-2 px-4 select-none">
              {/* Window control buttons */}
              <div className="flex items-center gap-1">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close terminal window"
                  title="Close (Esc)"
                  className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface transition-colors cursor-pointer"
                >
                  <span className="h-3 w-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors" />
                </button>
                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear terminal buffer"
                  title="Clear buffer (Ctrl+L)"
                  className="group flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface transition-colors cursor-pointer"
                >
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80 group-hover:bg-yellow-500 transition-colors" />
                </button>
                {/* Maximize Button */}
                <button
                  type="button"
                  onClick={() => setIsMaximized((prev) => !prev)}
                  aria-label={
                    isMaximized ? "Restore window size" : "Maximize window size"
                  }
                  title={isMaximized ? "Restore" : "Maximize"}
                  className="hidden sm:flex group h-6 w-6 items-center justify-center rounded-full hover:bg-surface transition-colors cursor-pointer"
                >
                  <span className="h-3 w-3 rounded-full bg-green-500/80 group-hover:bg-green-500 transition-colors" />
                </button>
              </div>

              {/* Title & Status */}
              <div className="flex items-center gap-2 font-mono text-[12px] text-muted">
                <TerminalIcon size={13} className="text-circuit" />
                <span className="font-semibold text-ink">
                  vaibhav@portfolio:~$
                </span>
                <span className="hidden xs:inline text-muted">ai_term</span>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMaximized((prev) => !prev)}
                  aria-label={
                    isMaximized ? "Restore terminal" : "Maximize terminal"
                  }
                  title={isMaximized ? "Restore" : "Maximize"}
                  className="hidden sm:inline-flex p-1.5 rounded-sm text-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
                >
                  {isMaximized ? (
                    <Minimize2 size={13} />
                  ) : (
                    <Maximize2 size={13} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close terminal"
                  className="sm:hidden p-1.5 rounded-sm text-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Terminal Body: Message Stream & Output */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 font-mono text-[13px] leading-relaxed space-y-4"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  {/* Message Meta / Speaker Line */}
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    {msg.role === "user" ? (
                      <span className="font-bold text-circuit flex items-center gap-1">
                        <span>&gt;</span> user
                      </span>
                    ) : msg.role === "system" ? (
                      <span className="text-accent flex items-center gap-1">
                        <Sparkles size={11} /> terminal.sys
                      </span>
                    ) : (
                      <span className="font-medium text-ink flex items-center gap-1">
                        <TerminalIcon size={11} className="text-circuit" />{" "}
                        ai_assistant
                      </span>
                    )}
                    <span className="text-muted/60 text-[10px]">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div
                    className={cn(
                      "pl-2 sm:pl-3 border-l-2",
                      msg.role === "user"
                        ? "border-circuit text-ink"
                        : msg.isError
                          ? "border-red-500 bg-red-500/5 p-2.5 rounded-sm"
                          : msg.role === "system"
                            ? "border-accent/60 text-muted"
                            : "border-border/80 text-ink",
                    )}
                  >
                    {msg.isError ? (
                      <div className="flex items-start gap-2 text-red-500 text-xs">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <div>{msg.content}</div>
                      </div>
                    ) : (
                      <TerminalMessage content={msg.content} />
                    )}
                  </div>
                </div>
              ))}

              {/* Loading / Thinking State */}
              {loading && (
                <div
                  className="space-y-1 pl-2 sm:pl-3 border-l-2 border-accent"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    <span className="text-accent flex items-center gap-1">
                      <Sparkles size={11} /> ai_assistant
                    </span>
                    <span className="text-muted/60 text-[10px]">
                      {getTimestamp()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted text-xs">
                    <span className="text-circuit font-mono">&gt;</span>
                    <span>Querying portfolio context...</span>
                    <span className="animate-blink text-accent font-bold">
                      ▍
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Prompt Suggestions (shown when buffer has <= 2 messages) */}
              {messages.length <= 2 && !loading && (
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted mb-2 font-mono">
                    Suggested Queries:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={loading}
                        onClick={() => handleSubmit(prompt)}
                        className="rounded-sm border border-border bg-surface-2/70 px-2.5 py-1 text-left font-mono text-[11.5px] text-ink hover:border-accent hover:text-accent transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <span className="text-circuit mr-1.5">&gt;</span>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form Bar */}
            <div className="border-t border-border bg-surface-2/50 p-3 sm:p-3.5">
              <form
                onSubmit={handleFormSubmit}
                className="flex items-center gap-2"
              >
                {/* Prompt symbol */}
                <span className="font-mono text-sm font-bold text-circuit select-none pl-1">
                  $
                </span>

                {/* Main input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  maxLength={500}
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or type 'help'..."
                  className="flex-1 bg-transparent font-mono text-[13px] text-ink placeholder:text-muted/60 focus:outline-none disabled:opacity-50"
                  aria-label="Terminal input prompt"
                />

                {/* Character counter / indicator */}
                {input.length > 200 && (
                  <span
                    className={cn(
                      "hidden xs:inline font-mono text-[10px]",
                      input.length >= 480
                        ? "text-red-500 font-bold"
                        : "text-muted",
                    )}
                  >
                    {input.length}/500
                  </span>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-8 w-8 items-center justify-center rounded-sm bg-ink text-canvas hover:bg-accent hover:text-accent-ink disabled:pointer-events-none disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <CornerDownLeft size={14} strokeWidth={2} />
                </button>
              </form>

              {/* Bottom Quick Help Bar */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted font-mono px-1">
                <span className="hidden sm:inline">
                  Press{" "}
                  <kbd className="rounded border border-border px-1 py-0.2 bg-surface">
                    Enter
                  </kbd>{" "}
                  to run,{" "}
                  <kbd className="rounded border border-border px-1 py-0.2 bg-surface">
                    ↑
                  </kbd>
                  <kbd className="rounded border border-border px-1 py-0.2 bg-surface">
                    ↓
                  </kbd>{" "}
                  for history
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                  >
                    <Download size={10} /> resume.pdf
                  </a>
                  <span>
                    type <strong className="text-circuit">help</strong>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
