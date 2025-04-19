import { z } from "zod";

export const bookZodSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),

  author: z
    .string()
    .min(3, "Author must be at least 3 characters long")
    .max(100, "Author must be at most 100 characters long")
    .trim(),

  isbn: z
    .string()
    .min(10, "ISBN must be at least 10 characters long")
    .max(13, "ISBN must be at most 13 characters long")
    .trim(),

  category: z
    .string()
    .min(3, "Category must be at least 3 characters long")
    .max(50, "Category must be at most 50 characters long")
    .trim(),

  stock: z
    .number()
    .min(0, "Stock must be at least 0")
    .max(100, "Stock must be at most 100"),

  available: z.boolean().default(true),
});
