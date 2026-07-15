import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, ChevronDown } from "lucide-react";
import { GithubIcon } from "@/components/icons/brand-icons";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);

  return (
    <section id="projects" className="container-page py-24 md:py-32">
      <SectionHeading
        eyebrow="Featured Projects"
        title="Two systems, built end to end."
        description="Selected work spanning AI product engineering and backend security."
      />

      <div className="space-y-4">
        {projects.map((project, index) => {
          const isOpen = openId === project.id;
          return (
            <Reveal key={project.id} delay={index * 0.06}>
              <Card className="overflow-hidden p-0">
                <button
                  onClick={() => setOpenId(isOpen ? null : project.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 font-mono text-xs text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-medium text-ink">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {project.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden font-mono text-xs text-muted sm:inline">
                      {project.duration}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "text-muted transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-6 pb-6 pt-5 md:pl-14">
                        <p className="max-w-2xl text-sm leading-relaxed text-ink">
                          {project.overview}
                        </p>

                        <ul className="mt-5 space-y-2.5">
                          {project.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm leading-relaxed text-muted"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              {h}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-5 rounded-sm border border-border bg-surface-2 px-4 py-3">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                            Impact
                          </span>
                          <p className="mt-1 text-sm text-ink">
                            {project.impact}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.tech.map((t) => (
                            <Badge key={t}>{t}</Badge>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                <GithubIcon width={14} height={14} />
                                GitHub
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!project.liveUrl}
                            asChild={Boolean(project.liveUrl)}
                          >
                            {project.liveUrl ? (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                <ExternalLink size={14} strokeWidth={1.75} />
                                Live Demo
                              </a>
                            ) : (
                              <span className="flex items-center gap-2">
                                <ExternalLink size={14} strokeWidth={1.75} />
                                Live Demo unavailable
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
