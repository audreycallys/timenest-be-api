import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title minimal 3 karakter")
      .max(100, "Title maksimal 100 karakter"),

    start_time: z.coerce.date({
      error: "Start time tidak valid",
    }),

    end_time: z.coerce.date({
      error: "End time tidak valid",
    }),

    participants: z
      .array(z.string().trim().min(1, "Nama participant tidak boleh kosong"))
      .min(1, "Minimal harus ada 1 participant"),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Start time harus lebih kecil dari end time",
    path: ["end_time"],
  });

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title minimal 3 karakter")
      .max(100, "Title maksimal 100 karakter")
      .optional(),

    start_time: z.coerce.date().optional(),

    end_time: z.coerce.date().optional(),

    participants: z
      .array(z.string().trim().min(1, "Nama participant tidak boleh kosong"))
      .min(1, "Minimal harus ada 1 participant")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        return data.start_time < data.end_time;
      }

      return true;
    },
    {
      message: "Start time harus lebih kecil dari end time",
      path: ["end_time"],
    },
  );

export const eventIdSchema = z.object({
  id: z.uuid("Event ID tidak valid"),
});

export const eventQuerySchema = z.object({
  participant: z.string().trim().optional(),
});
