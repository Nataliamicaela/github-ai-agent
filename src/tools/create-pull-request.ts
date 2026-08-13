export const createPullRequestTool = {
    name: "create_pull_request",
    description:
        "Crea un Pull Request en un repositorio de GitHub entre dos ramas.",
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
                description: "Título del Pull Request.",
            },
            body: {
                type: "string",
                description: "Descripción del Pull Request.",
            },
            head: {
                type: "string",
                description: "Rama de origen que contiene los cambios.",
            },
            base: {
                type: "string",
                description: "Rama de destino que recibirá los cambios.",
            },
        },
        required: ["owner", "repo", "title", "head", "base"],
    },
};