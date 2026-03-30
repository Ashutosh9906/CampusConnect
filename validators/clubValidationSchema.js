import { z } from "zod";

const clubId = z.object({
    id: z.string().cuid()
});

export const clubIdSchema = z.object({
  body: z.object({}).optional(),
  params: clubId,
  query: z.object({}).optional(),
}).strict();

const clubPostBosy = z.object({
    name: z.string().min(1, "Invalid club name"),
    description: z.string().min(20, "Elovarate the club description"),
    clubCoordinator: z.string().min(3, "Invalid name")
})

export const clubPostSchema = z.object({
  body: clubPostBosy,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
}).strict();