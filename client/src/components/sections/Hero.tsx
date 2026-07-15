import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/use-typewriter";
import { scrollToId } from "@/utils/dom";

const consoleLines = [
  "> whoami",
  "vaibhav_garg — ai full-stack developer",
  "> stack --primary",
  "react · node.js · typescript · postgresql · gemini api",
  "> status",
  "available for software & ai engineering roles",
];

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { output, doneIndex } = useTypewriter(consoleLines, 22, 220);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="container-page relative grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-circuit opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-circuit" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {profile.status}
            </span>
          </div>

          <h1 className="font-display text-4xl font-medium leading-[1.08] text-balance text-ink sm:text-5xl lg:text-6xl">
            Building AI-integrated products, from database to interface.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button onClick={() => scrollToId("projects")}>
              View Projects
              <ArrowRight size={15} strokeWidth={1.75} />
            </Button>
            <Button variant="outline" onClick={() => scrollToId("contact")}>
              <Mail size={15} strokeWidth={1.75} />
              Contact Me
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-3 font-mono text-[11px] text-muted">
                profile.sh
              </span>
            </div>
            <div className="min-h-[220px] p-5 font-mono text-[13px] leading-relaxed">
              {consoleLines.map((line, i) => {
                const isCommand = line.startsWith(">");
                const text = output[i];
                const isCurrentLine =
                  i === doneIndex + 1 && text.length < line.length;
                return (
                  <div key={i} className="min-h-[1.6em]">
                    <span className={isCommand ? "text-circuit" : "text-ink"}>
                      {text}
                    </span>
                    {isCurrentLine && (
                      <span className="animate-blink text-accent">▍</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
