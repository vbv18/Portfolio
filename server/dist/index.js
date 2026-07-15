import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env.js";
import { contactRouter } from "./routes/contact.js";
const app = express();
app.use(helmet());
app.use(cors({
    origin: env.CLIENT_ORIGIN.split(",").map((o) => o.trim()),
    methods: ["GET", "POST"],
}));
app.use(express.json({ limit: "20kb" }));
app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api", contactRouter);
app.use((_req, res) => {
    res.status(404).json({ message: "Not found" });
});
const port = Number(env.PORT);
app.listen(port, () => {
    console.log(`Contact API listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map