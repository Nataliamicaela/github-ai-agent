export const slugifyTool = {
    name: "slugify",
    description: "Convierte un texto en un slug usando minúsculas y guiones.",
    inputSchema: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "Texto que se quiere convertir en slug",
            },
        },
        required: ["text"],
    },
};