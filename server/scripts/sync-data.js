import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncPortfolioData() {
  const clientDataDir = path.resolve(__dirname, "../../client/src/data");
  const targetFile = path.resolve(__dirname, "../src/lib/portfolio-data.generated.json");

  try {
    const profileModule = await import(pathToFileURL(path.join(clientDataDir, "profile.ts")).href);
    const projectsModule = await import(pathToFileURL(path.join(clientDataDir, "projects.ts")).href);
    const skillsModule = await import(pathToFileURL(path.join(clientDataDir, "skills.ts")).href);
    const historyModule = await import(pathToFileURL(path.join(clientDataDir, "history.ts")).href);

    // Sanitize profile: Exclude phone and internal fields
    const rawProfile = profileModule.profile;
    const { phone: _phone, ...sanitizedProfile } = rawProfile;

    const data = {
      profile: sanitizedProfile,
      projects: projectsModule.projects,
      skills: skillsModule.skillCategories,
      experience: historyModule.experience,
      education: historyModule.education,
      certifications: historyModule.certifications,
      achievements: historyModule.achievements,
      aboutCards: historyModule.aboutCards,
      lastSyncedAt: new Date().toISOString(),
    };

    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), "utf-8");
    console.log("✔ Synced & sanitized canonical portfolio data to server/src/lib/portfolio-data.generated.json");
  } catch (error) {
    console.error("❌ Failed to sync portfolio data:", error);
    process.exit(1);
  }
}

syncPortfolioData();
