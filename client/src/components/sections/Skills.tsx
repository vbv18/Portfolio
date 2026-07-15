import { skillCategories } from "@/data/skills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Skills() {
  return (
    <section
      id="skills"
      className="border-t border-border bg-surface-2/40 py-24 md:py-32"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="Skills"
          title="A full-stack toolbox, organized by layer."
          description="From typed languages to AI integration — the tools used to ship production systems."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Card className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-base font-medium text-ink">
                    {cat.title}
                  </h3>
                  <span className="font-mono text-[11px] text-muted">
                    {cat.eyebrow}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
