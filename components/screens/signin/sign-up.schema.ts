import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // rememberMe: z.boolean().optional(),
})

export type SignInSchema = z.infer<typeof signInSchema>;

// This is the old way of doing it, but "infer" is a better way to do it by zod library
// export type SignInSchema = {
//     email: string;
//     password: string;
    // rememberMe: boolean; // true || false
// };