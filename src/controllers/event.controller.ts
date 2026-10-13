import { Request, Response } from "express";
import { db } from "../db";
import { events } from "../db/schema";
import { createEventSchema } from "../validations/event.validation";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(events);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const validatedData = createEventSchema.parse(req.body);

    const { title, start_time, end_time, participants } = validatedData;

    const [newEvent] = await db
      .insert(events)
      .values({
        title,
        startTime: start_time,
        endTime: end_time,
        participants,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error instanceof Error ? error.message : error,
    });
  }
};
