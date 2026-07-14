import type { Project } from '@/types'

export const projects: Project[] = [
    {
        id: 'forge-ai',
        title: 'Forge AI',
        tagline: 'AI-powered React application builder',
        duration: "Jun '26 – Jul '26",
        tech: [
            'Next.js',
            'React',
            'TypeScript',
            'Node.js',
            'Supabase',
            'Clerk',
            'Prisma',
            'Gemini API',
            'Cline SDK',
            'Sandpack',
            'Arcjet',
        ],
        overview:
            'A full-stack AI application builder that generates production-ready React applications from natural language prompts, with live code preview, streaming AI responses, and persistent workspaces.',
        highlights: [
            'Integrated the Gemini API for streaming code generation, image-assisted prompting, persistent chat history, and structured multi-file project generation using Supabase and Prisma.',
            'Built scalable backend APIs with Clerk authentication, role-based access control, and subscription-based credit management.',
            'Added Arcjet rate limiting and AI-powered code improvement using the Cline SDK.',
        ],
        impact:
            'Turns a natural-language prompt into a runnable, multi-file React app with a live in-browser preview.',
        githubUrl: 'https://github.com/vbv18/Forge',
    },
    {
        id: 'auth-system',
        title: 'Secure Authentication & Session Management System',
        tagline: 'Production-grade JWT auth backend',
        duration: "May '26",
        tech: ['Node.js', 'Express.js', 'TypeScript', 'MongoDB', 'JWT', 'Zod'],
        overview:
            'A modular, feature-based backend architecture with reusable middleware, centralized error handling, and type-safe request validation using Zod.',
        highlights: [
            'Implemented production-ready JWT authentication using short-lived access tokens, rotating refresh tokens, HTTP-only cookies, and hashed token storage.',
            'Protected REST APIs with layered middleware and centralized error handling.',
            'Built session management with refresh token rotation, replay attack detection, concurrent session limits, and MongoDB TTL indexes.',
        ],
        impact:
            'Supports single-device and multi-device logout with replay-attack-resistant session rotation.',
        githubUrl: 'https://github.com/vbv18/auth-template-ts',
    },
]
