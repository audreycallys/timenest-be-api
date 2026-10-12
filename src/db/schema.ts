import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  serial,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  startTime: timestamp("start_time", {
    withTimezone: true,
  }).notNull(),
  endTime: timestamp("end_time", {
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const eventParticipants = pgTable(
  "event_participants",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, {
        onDelete: "cascade",
      }),
    participantId: integer("participant_id")
      .notNull()
      .references(() => participants.id, {
        onDelete: "cascade",
      }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.eventId, table.participantId],
    }),
  }),
);
