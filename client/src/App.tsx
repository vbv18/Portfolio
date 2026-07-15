import { Header } from "@/components/layout/Header";
import { lazy, Suspense } from "react";

const About = lazy(() => import('@/components/sections/About').then((m) => ({ default: m.About })))

export default function App() {
  return (
    <>
      {/* <ScrollProgress /> */}
      <Header />

      <main>
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
      </main>
    </>
  );
}

function SectionFallback() {
  return (
    <div className="h-[40vh] w-full" aria-hidden="true" />
  )
}
