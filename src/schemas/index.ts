import { z } from "zod";

export const PingInputSchema = z.object({});

export const SumInputSchema = z.object({
    a: z.number(),
    b: z.number(),
});

export const SlugifyInputSchema = z.object({
    text: z.string().min(1, "El texto no puede estar vacío."),
});

export const CreateRepositoryInputSchema = z.object({
    name: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(100, "El nombre no puede superar los 100 caracteres.")
        .regex(
            /^[a-zA-Z0-9-]+$/,
            "El nombre solo puede contener letras, números y guiones."
        ),

    description: z
        .string()
        .max(500, "La descripción no puede superar los 500 caracteres.")
        .optional(),

    private: z.boolean().optional(),
});