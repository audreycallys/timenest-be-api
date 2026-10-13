import { Request, Response } from "express";
import { and, eq, gt, lt, ne } from "drizzle-orm";
import { db } from "../db";
import { events } from "../db/schema";
import {
  createEventSchema,
  updateEventSchema,
  eventIdSchema,
  eventQuerySchema,
} from "../validations/event.validation";

export class EventsController {
  // Create
  createEvent = async (req: Request, res: Response) => {
    try {
      const validatedData = createEventSchema.parse(req.body);

      const { title, start_time, end_time, participants } = validatedData;

      const overlappingEvents = await db
        .select()
        .from(events)
        .where(
          and(lt(events.startTime, end_time), gt(events.endTime, start_time)),
        );

      const conflicts = overlappingEvents
        .map((event) => {
          const conflictingParticipants = participants.filter((participant) =>
            event.participants.includes(participant),
          );

          return {
            event,
            conflictingParticipants,
          };
        })
        .filter((item) => item.conflictingParticipants.length > 0);

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Schedule conflict detected",
          data: {
            conflicts,
          },
        });
      }

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
        data: {
          event: newEvent,
        },
      });
    } catch (error) {
      console.error("Create event error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Read all
  getEvents = async (req: Request, res: Response) => {
    try {
      const validatedQuery = eventQuerySchema.parse(req.query);

      const result = await db.select().from(events);

      return res.status(200).json({
        success: true,
        message: "Get Events Successfully",
        data: {
          events: result,
        },
      });
    } catch (error) {
      console.error("Get events error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Read by id
  getEventById = async (req: Request, res: Response) => {
    try {
      const validatedParams = eventIdSchema.parse(req.params);
      const { id } = validatedParams;

      const [event] = await db.select().from(events).where(eq(events.id, id));

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event Not Found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Event retrieved successfully",
        data: {
          event,
        },
      });
    } catch (error) {
      console.error("Get event by id error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Update
  updateEvent = async (req: Request, res: Response) => {
    try {
      const validatedParams = eventIdSchema.parse(req.params);
      const { id } = validatedParams;

      const validatedData = updateEventSchema.parse(req.body);

      const [existingEvent] = await db
        .select()
        .from(events)
        .where(eq(events.id, id));

      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          message: "Event Not Found",
        });
      }

      const finalTitle = validatedData.title ?? existingEvent.title;

      const finalStartTime =
        validatedData.start_time ?? existingEvent.startTime;

      const finalEndTime = validatedData.end_time ?? existingEvent.endTime;

      const finalParticipants =
        validatedData.participants ?? existingEvent.participants;

      if (finalStartTime >= finalEndTime) {
        return res.status(400).json({
          success: false,
          message: "Start time harus lebih kecil dari end time",
        });
      }

      const overlappingEvents = await db
        .select()
        .from(events)
        .where(
          and(
            ne(events.id, id),
            lt(events.startTime, finalEndTime),
            gt(events.endTime, finalStartTime),
          ),
        );

      const conflicts = overlappingEvents
        .map((event) => {
          const conflictingParticipants = finalParticipants.filter(
            (participant) => event.participants.includes(participant),
          );

          return {
            event,
            conflictingParticipants,
          };
        })
        .filter((item) => item.conflictingParticipants.length > 0);

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Schedule conflict detected",
          data: {
            conflicts,
          },
        });
      }

      const [updatedEvent] = await db
        .update(events)
        .set({
          title: finalTitle,
          startTime: finalStartTime,
          endTime: finalEndTime,
          participants: finalParticipants,
        })
        .where(eq(events.id, id))
        .returning();

      return res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: {
          event: updatedEvent,
        },
      });
    } catch (error) {
      console.error("Update event error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };

  // Delete
  deleteEvent = async (req: Request, res: Response) => {
    try {
      const validatedParams = eventIdSchema.parse(req.params);
      const { id } = validatedParams;

      const [existingEvent] = await db
        .select()
        .from(events)
        .where(eq(events.id, id));

      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          message: "Event Not Found",
        });
      }

      await db.delete(events).where(eq(events.id, id));

      return res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Delete event error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}

export default new EventsController();
