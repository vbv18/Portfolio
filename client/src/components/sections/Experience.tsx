import { experience } from "@/data/history";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";

export function Experience() {
  return (
    <section
      id="experience"
      className="border-t border-border bg-surface-2/40 py-24 md:py-32"
    >
      <div className="container-page">
        <SectionHeading eyebrow="Experience" title="Time in the field." />

        <div className="relative max-w-2xl border-l border-border pl-8">
          {experience.map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 0.08}
              className="relative pb-10 last:pb-0"
            >
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-canvas" />
              <span className="font-mono text-xs text-accent">
                {item.period}
              </span>
              <h3 className="mt-1.5 font-display text-lg font-medium text-ink">
                {item.role}
              </h3>
              <p className="text-sm text-muted">
                {item.org} &middot; {item.location}
              </p>
              <ul className="mt-3 space-y-2">
                {item.points.map((p, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-circuit" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
