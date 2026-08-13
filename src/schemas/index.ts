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

export const CreateIssueInputSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es obligatorio."),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es obligatorio."),

    title: z
        .string()
        .min(1, "El título del issue es obligatorio.")
        .max(256, "El título no puede superar los 256 caracteres."),

    body: z
        .string()
        .max(10000, "El body no puede superar los 10000 caracteres.")
        .optional(),
});

export const ListIssuesInputSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es obligatorio."),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es obligatorio."),
});

export const ListPullRequestsInputSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es obligatorio."),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es obligatorio."),
});

export const CreatePullRequestInputSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es obligatorio."),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es obligatorio."),

    title: z
        .string()
        .min(1, "El título del Pull Request es obligatorio."),

    body: z.string().optional(),

    head: z
        .string()
        .min(1, "La rama de origen es obligatoria."),

    base: z
        .string()
        .min(1, "La rama de destino es obligatoria."),
});

export const CreateCommitInputSchema = z.object({
    owner: z
        .string()
        .min(1, "El propietario del repositorio es obligatorio."),

    repo: z
        .string()
        .min(1, "El nombre del repositorio es obligatorio."),

    path: z
        .string()
        .min(1, "La ruta del archivo es obligatoria."),

    message: z
        .string()
        .min(1, "El mensaje del commit es obligatorio."),

    content: z
        .string()
        .min(1, "El contenido del archivo es obligatorio."),

    branch: z
        .string()
        .min(1, "La rama es obligatoria.")
        .optional(),

    sha: z
        .string()
        .optional(),
});