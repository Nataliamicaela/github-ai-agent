import { CreateRepositoryInputSchema } from "../schemas/index.js";
import { createRepository } from "../github/operations.js";

export const createRepositoryTool = {
    name: "create_repository",
    description: "Crea un nuevo repositorio en GitHub con un nombre y una descripción.",
    inputSchema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Nombre del repositorio.",
            },
            description: {
                type: "string",
                description: "Descripción del repositorio.",
            },
            private: {
                type: "boolean",
                description: "Indica si el repositorio será privado.",
            },
        },
        required: ["name"],
    },
};