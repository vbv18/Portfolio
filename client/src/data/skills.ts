import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    eyebrow: "01",
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C/C++", "HTML", "CSS"],
  },
  {
    id: "frontend",
    eyebrow: "02",
    title: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS"],
  },
  {
    id: "backend",
    eyebrow: "03",
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT Authentication"],
  },
  {
    id: "databases",
    eyebrow: "04",
    title: "Databases & ORM",
    items: ["PostgreSQL", "MongoDB", "Supabase", "Prisma", "Mongoose"],
  },
  {
    id: "ai",
    eyebrow: "05",
    title: "AI / LLMs",
    items: ["Vercel AI SDK", "Gemini API", "LLM Integration", "Prompt Engineering"],
  },
  {
    id: "tools",
    eyebrow: "06",
    title: "Developer Tools",
    items: ["Git", "GitHub", "Postman", "Clerk", "Arcjet", "Turborepo", "Zod"],
  },
  {
    id: "core-cs",
    eyebrow: "07",
    title: "Core CS",
    items: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
    ],
  },
];
