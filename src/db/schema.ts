import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", {
    length: 255,
  }).notNull(),

  startTime: timestamp("start_time", {
    withTimezone: true,
  }).notNull(),

  endTime: timestamp("end_time", {
    withTimezone: true,
  }).notNull(),

  participants: text("participants").array().notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
