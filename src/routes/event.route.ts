import { Router } from "express";
import eventController from "../controllers/event.controller";

const router = Router();

router.post("/", eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;