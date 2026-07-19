import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "forge-ai",
    title: "Forge AI",
    tagline: "AI-powered React application builder",
    duration: "Jun '26 – Jul '26",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Supabase",
      "Clerk",
      "Prisma",
      "Gemini API",
      "Vercel AI SDK",
      "Sandpack",
      "Arcjet",
    ],
    overview:
      "A full-stack AI application builder that turns natural language prompts into production-ready, multi-file React projects, with live sandboxed previews, streaming AI responses, and persistent workspaces.",
    highlights: [
      "Architected a real-time code generation pipeline with the Gemini API and Vercel AI SDK, supporting image-assisted prompting, structured multi-file project generation, and conversational AI-driven code refinement.",
      "Built a scalable backend with Prisma, PostgreSQL, and Supabase for project persistence and credit-based subscription management.",
      "Secured APIs with Clerk authentication, role-based authorization, and Arcjet rate limiting to prevent abuse.",
    ],
    impact:
      "Turns a natural-language prompt into a runnable, multi-file React app with a live in-browser preview.",
    githubUrl: "https://github.com/vbv18/Forge",
    liveUrl: "https://forge-vbv18.vercel.app/",
  },
  {
    id: "auth-system",
    title: "Production Authentication Service",
    tagline: "Production-grade JWT auth backend",
    duration: "May '26",
    tech: ["Node.js", "Express.js", "TypeScript", "MongoDB", "JWT", "Zod"],
    overview:
      "A modular, feature-based authentication backend with reusable middleware, centralized error handling, and type-safe request validation using Zod.",
    highlights: [
      "Implemented full auth workflows — register, login, refresh, logout, logout-all — using JWT access tokens, rotating refresh tokens, HTTP-only cookies, and hashed token storage.",
      "Secured REST endpoints with layered middleware and centralized error handling.",
      "Hardened sessions with refresh token rotation, replay attack detection, concurrent session limits, and MongoDB TTL indexes.",
    ],
    impact:
      "Supports single-device and multi-device logout with replay-attack-resistant session rotation.",
    githubUrl: "https://github.com/vbv18/auth-template-ts",
  },
];
