import {
  GraduationCap,
  Target,
  Server,
  Sparkles,
  Puzzle,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { aboutCards } from "@/data/history";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const icons: Record<string, LucideIcon> = {
  GraduationCap,
  Target,
  Server,
  Sparkles,
  Puzzle,
  Radio,
};

export function About() {
  return (
    <section id="about" className="container-page py-24 md:py-32">
      <SectionHeading
        eyebrow="About"
        title="An engineer who ships the whole system."
        description="Grounded in electronics and core CS, working across backend, frontend, and applied AI."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aboutCards.map((card, i) => {
          const Icon = icons[card.icon];
          return (
            <Reveal key={card.id} delay={i * 0.06}>
              <Card className="h-full hover:border-ink/40 dark:hover:border-accent/50 transition-colors">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm border border-border text-accent">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <CardTitle className="mb-2">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
