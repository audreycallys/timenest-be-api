import express from "express";
import { db } from "./db";
import { events } from "./db/schema";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello New Project Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/events", async (req, res) => {
  const result = await db.select().from(events);

  res.json({
    success: true,
    data: result,
  });
});
