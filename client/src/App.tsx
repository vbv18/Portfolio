import { Header } from "@/components/layout/Header";
import { lazy, Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Toaster } from "sonner";

const About = lazy(() =>
  import("@/components/sections/About").then((m) => ({ default: m.About })),
);
const Skills = lazy(() =>
  import("@/components/sections/Skills").then((m) => ({ default: m.Skills })),
);
const Projects = lazy(() =>
  import("@/components/sections/Projects").then((m) => ({
    default: m.Projects,
  })),
);
const Experience = lazy(() =>
  import("@/components/sections/Experience").then((m) => ({
    default: m.Experience,
  })),
);
const Credentials = lazy(() =>
  import("@/components/sections/Credentials").then((m) => ({
    default: m.Credentials,
  })),
);
const Achievements = lazy(() =>
  import("@/components/sections/Achievements").then((m) => ({
    default: m.Achievements,
  })),
);

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Credentials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Achievements />
        </Suspense>
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-ink)",
            border: "1px solid var(--color-border)",
            fontFamily: "var(--font-body)",
            fontSize: "13.5px",
          },
        }}
      />
    </>
  );
}

function SectionFallback() {
  return <div className="h-[40vh] w-full" aria-hidden="true" />;
}
