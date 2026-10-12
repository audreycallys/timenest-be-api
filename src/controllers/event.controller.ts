import { Request, Response } from "express";
import { db } from "../db";
import { events } from "../db/schema";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(events);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, start_time, end_time } = req.body;

    if (!title || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "title, start_time, and end_time are required",
      });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "start_time must be earlier than end_time",
      });
    }

    const [newEvent] = await db
      .insert(events)
      .values({
        title,
        startTime,
        endTime,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
};
