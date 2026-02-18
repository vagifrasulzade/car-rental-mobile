import { z } from "zod";
import { signInSchema } from "../screens/signin/sign-up.schema";

export const passwordSchema = z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(14, { message: 'Password must be no more than 14 characters' });

export const signUpSchema = signInSchema.merge(z.object({
    name: z.string().min(1, "Name is required"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
})).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

// This is the old way of doing it, but "infer" is a better way to do it by zod library
// export type SignInSchema = {
//     email: string;
//     password: string;
//     rememberMe: boolean; // true || false
// };