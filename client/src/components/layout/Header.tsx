import { useEffect, useState } from "react";
import { Menu, X, ArrowDownToLine } from "lucide-react";
import { navLinks } from "@/data/nav";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";
import { scrollToId } from "@/utils/dom";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useActiveSection(
    navLinks.map((l) => l.href.replace("#", "")),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <button
          onClick={() => scrollToId("hero")}
          className="font-display text-sm font-semibold tracking-tight text-ink"
          aria-label="Go to top"
        >
          Vaibhav<span className="text-accent">.</span>Garg
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeId === id;
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={cn(
                  "relative px-3.5 py-2 text-sm transition-colors",
                  isActive ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a href="/resume.pdf" download>
            <Button variant="outline" size="sm">
              <ArrowDownToLine size={14} strokeWidth={1.75} />
              Resume
            </Button>
          </a>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-canvas md:hidden">
          <nav className="container-page flex flex-col py-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="border-b border-border/60 py-3.5 text-left text-sm text-ink last:border-none"
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center justify-between py-4">
              <ThemeToggle />
              <a href="/resume.pdf" download>
                <Button variant="outline" size="sm">
                  <ArrowDownToLine size={14} strokeWidth={1.75} />
                  Resume
                </Button>
              </a>
            </div>
          </nav>
        </div>
      )}
      <span className="sr-only">{profile.name}</span>
    </header>
  );
}
