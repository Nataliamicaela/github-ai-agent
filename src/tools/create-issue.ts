export const createIssueTool = {
    name: "create_issue",
    description:
        "Crea un nuevo issue en un repositorio de GitHub especificado por su propietario y nombre.",
    inputSchema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "Usuario u organización propietaria del repositorio.",
            },
            repo: {
                type: "string",
                description: "Nombre del repositorio.",
            },
            title: {
                type: "string",
                description: "Título del issue.",
            },
            body: {
                type: "string",
                description: "Descripción o contenido del issue.",
            },
        },
        required: ["owner", "repo", "title"],
    },
};