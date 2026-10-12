import express from "express";
import eventRoutes from "./routes/event.route";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello New Project Express + TypeScript!");
});

app.use("/api/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});