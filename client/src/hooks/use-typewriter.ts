import { useEffect, useState } from "react";

export function useTypewriter(lines: string[], speed = 28, lineDelay = 260) {
  const [output, setOutput] = useState<string[]>(() => lines.map(() => ""));
  const [doneIndex, setDoneIndex] = useState(-1);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;
        const line = lines[i];
        for (let c = 1; c <= line.length; c++) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, speed));
          setOutput((prev) => {
            const next = [...prev];
            next[i] = line.slice(0, c);
            return next;
          });
        }
        setDoneIndex(i);
        await new Promise((r) => setTimeout(r, lineDelay));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { output, doneIndex, complete: doneIndex === lines.length - 1 };
}
