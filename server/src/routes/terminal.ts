import { Router, type Request, type Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { env } from "../lib/env.js";
import { terminalMessageSchema } from "../lib/validation.js";
import { terminalRateLimiter } from "../middleware/rate-limiter.js";
import {
  getDynamicSystemPrompt,
  getPortfolioData,
} from "../lib/portfolio-context-adapter.js";

export const terminalRouter = Router();

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return aiClient;
}

// GET /api/terminal/info - Fast local info summary for terminal commands
terminalRouter.get("/info", (_req: Request, res: Response) => {
  const data = getPortfolioData();
  return res.json({
    name: data.profile.name,
    role: data.profile.role,
    status: data.profile.status,
    location: data.profile.location,
    projects: data.projects.map((p) => ({
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      tech: p.tech,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
    })),
    skills: data.skills,
    email: data.profile.email,
    linkedin: data.profile.linkedin,
    github: data.profile.github,
    lastSyncedAt: data.lastSyncedAt,
  });
});

// POST /api/terminal - Grounded Q&A via Gemini Interactions API
terminalRouter.post(
  "/",
  terminalRateLimiter,
  async (req: Request, res: Response) => {
    const parsed = terminalMessageSchema.safeParse(req.body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ??
        "Invalid query format. Please enter a valid message.";
      return res.status(400).json({ message: firstError });
    }

    const { message, history = [] } = parsed.data;

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        message:
          "The AI Terminal service is in demo mode. GEMINI_API_KEY is not configured in the server environment.",
      });
    }

    try {
      // Build typed interaction steps for conversation history
      const inputSteps = history.slice(-6).map((item) => ({
        type:
          item.role === "user"
            ? ("user_input" as const)
            : ("model_output" as const),
        content: [{ type: "text" as const, text: item.content }],
      }));

      // Append current user message
      inputSteps.push({
        type: "user_input" as const,
        content: [{ type: "text" as const, text: message }],
      });

      const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";

      // Invoke Gemini model via Interactions API with strict grounding
      const interaction = await ai.interactions.create({
        model,
        system_instruction: getDynamicSystemPrompt(),
        input: inputSteps,
        store: false,
        generation_config: {
          max_output_tokens: 1000,
          thinking_level: "low",
        },
      });

      const replyText =
        interaction.output_text?.trim() ||
        "I was unable to generate a response. Please try rephrasing your question.";

      return res.status(200).json({
        reply: replyText,
        model,
      });
    } catch (error: unknown) {
      // Safe error logging without exposing secrets
      const errorMessage =
        error instanceof Error ? error.message : "Unknown Gemini API error";
      console.error("❌ Gemini Interactions API terminal error:", errorMessage);

      if (
        errorMessage.includes("API_KEY_INVALID") ||
        errorMessage.includes("API key not valid")
      ) {
        return res.status(502).json({
          message: "AI service configuration error: Invalid GEMINI_API_KEY.",
        });
      }

      if (
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("Quota")
      ) {
        return res.status(429).json({
          message:
            "Gemini API rate limit exceeded. Please wait a moment before trying again.",
        });
      }

      return res.status(502).json({
        message:
          "Could not reach the AI assistant right now. Please try again in a few moments.",
      });
    }
  },
);
