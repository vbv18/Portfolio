import { Trophy } from "lucide-react";
import { achievements } from "@/data/history";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Card } from "@/components/ui/card";

export function Achievements() {
  return (
    <section id="achievements" className="container-page py-24 md:py-32">
      <SectionHeading eyebrow="Achievements" title="Results that stack up." />

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.05}>
            <Card className="flex h-full items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-accent">
                <Trophy size={16} strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-display text-[15px] font-medium leading-snug text-ink">
                  {item.title}
                </p>
                {item.detail && (
                  <p className="mt-1 text-sm text-muted">{item.detail}</p>
                )}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
