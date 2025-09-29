import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  features: z.array(z.string()).nonempty(),
  thumbnail: z.array(z.string().url()).nonempty(),
  liveUrl: z.string().url(),
  authorId: z.number().int().positive()
})

export type ProjectInput = z.infer<typeof projectSchema>
