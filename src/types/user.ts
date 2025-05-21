import { z } from "zod";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
})
