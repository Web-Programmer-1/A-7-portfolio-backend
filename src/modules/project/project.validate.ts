import {z} from "zod";



export const projectSchema = z.object({
    title:z.string().min(4, {message:"Title must be at least 4 characters long"}).max(100, {message:"Title must be a maximum 100 charcter"}).trim(),
    description:z.string().min(10, {message:"description must be at least  10 characters"}).max(300, {message:"description must be a maximum chatcter 300 "}).trim(),
 features: z.array(z.string()).nonempty(),
  thumbnail: z.array(z.string().url()).nonempty(),
  liveUrl: z.string().url(),
  authorId: z.number().int().positive()

});


export type ProjectInput = z.infer<typeof projectSchema>

