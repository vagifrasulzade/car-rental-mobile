import { z } from "zod";

export const personalInformationSchema = z.object({
    avatar: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().optional().default(""),
    membership: z.enum(["Regular", "Premium"]).default("Regular"),
});

export type PersonalInformationSchemaInput = z.input<typeof personalInformationSchema>;
export type PersonalInformationSchemaType = z.output<typeof personalInformationSchema>;