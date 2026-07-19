import type {
  AchievementItem,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  AboutCard,
} from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "bel",
    role: "Internship Trainee",
    org: "Bharat Electronics Limited (BEL)",
    location: "Ghaziabad",
    period: "Jun '25",
    points: [
      "Decoded ASTERIX CAT048 radar surveillance packets using Wireshark and ASTERIX Inspector, cross-referencing internal protocol documentation and a C-based bitstream parser.",
      "Studied real-time data flow and structured packet formats used in aviation surveillance systems.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    id: "btech",
    degree: "B.Tech, Electronics & Communication Engineering",
    institute: "The LNM Institute of Information Technology, Jaipur",
    score: "7.75 CGPA",
    period: "Aug 2023 – Present",
  },
  {
    id: "xii",
    degree: "Senior Secondary (XII)",
    institute: "NKBR Academy, Meerut",
    score: "92.80%",
    period: "2023",
  },
  {
    id: "x",
    degree: "Secondary (X)",
    institute: "K. L. International School, Meerut",
    score: "95.80%",
    period: "2021",
  },
];

export const certifications: CertificationItem[] = [
  {
    id: "tcs-ion",
    title: "Career Edge - Young Professional, Certificate of Achievement",
    issuer: "TCS iON",
    date: "Jul '25",
    href: "https://drive.google.com/file/d/1y1HxZtihtyvOZ3gge3eCva5aFOetqpt7/view?usp=drive_link",
  },
  {
    id: "c-programming",
    title: "Certification in C Programming Language",
    issuer: "Nav Bharat Institute of Technology",
    date: "Jul '23",
    href: "https://drive.google.com/file/d/1L1Lop-4Pglo68z2REYDvjc2S43Ar656B/view?usp=drive_link",
  },
];

export const achievements: AchievementItem[] = [
  {
    id: "gate",
    title: "AIR 2217 in GATE 2026, Electronics & Communication",
  },
  {
    id: "chipin",
    title: "Top 12 finalist, ChipIN Design Hackathon 2025 (MeitY)",
    detail: "Sponsored by Synopsys & AMD",
  },
  {
    id: "lnmiit-rank",
    title: "Top 7% of students at LNMIIT",
    detail: "By academic performance",
  },
  {
    id: "elitmus",
    title: "Top 70 of 400 participants",
    detail: "eLitmus assessment at LNMIIT",
  },
  {
    id: "jee",
    title: "96.20 percentile, JEE Main 2023",
    detail: "99.21 percentile in Physics",
  },
];

export const aboutCards: AboutCard[] = [
  {
    id: "education",
    title: "Education",
    description:
      "B.Tech in Electronics & Communication Engineering at LNMIIT Jaipur, 7.75 CGPA.",
    icon: "GraduationCap",
  },
  {
    id: "focus",
    title: "Current Focus",
    description:
      "Shipping AI-integrated full-stack products — from streaming LLM APIs to production auth systems.",
    icon: "Target",
  },
  {
    id: "backend",
    title: "Backend Development",
    description:
      "Type-safe REST APIs, JWT auth, session security, and relational + document databases.",
    icon: "Server",
  },
  {
    id: "ai-engineering",
    title: "AI Engineering",
    description:
      "Integrating LLMs like Gemini into real products: streaming generation, prompting, structured output.",
    icon: "Sparkles",
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description:
      "Strong CS fundamentals — DSA, OOP, DBMS, OS, Computer Networks — applied to real systems.",
    icon: "Puzzle",
  },
  {
    id: "interests",
    title: "Interests",
    description:
      "Electronics-rooted engineer exploring where signal processing, systems, and AI intersect.",
    icon: "Radio",
  },
];
