import { Award } from "lucide-react";
import { education, certifications } from "@/data/history";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Card } from "@/components/ui/card";

export function Credentials() {
  return (
    <section
      id="education"
      className="border-t border-border bg-surface-2/40 py-24 md:py-32"
    >
      <div className="container-page grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Education" title="Academic record." />
          <div className="relative border-l border-border pl-8">
            {education.map((item, i) => (
              <Reveal
                key={item.id}
                delay={i * 0.06}
                className="relative pb-8 last:pb-0"
              >
                <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-circuit bg-canvas" />
                <span className="font-mono text-xs text-muted">
                  {item.period}
                </span>
                <h3 className="mt-1 font-display text-base font-medium text-ink">
                  {item.degree}
                </h3>
                <p className="text-sm text-muted">{item.institute}</p>
                <p className="mt-1 font-mono text-xs text-accent">
                  {item.score}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Certifications"
            title="Verified credentials."
          />
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 0.06}>
                <Card className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-circuit">
                    <Award size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-display text-[15px] font-medium leading-snug text-ink">
                      {cert.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {cert.issuer} &middot;{" "}
                      <span className="font-mono text-xs">{cert.date}</span>
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
