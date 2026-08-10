export const listPullRequestsTool = {
    name: "list_pull_requests",
    description:
        "Lista los Pull Requests abiertos de un repositorio específico de GitHub.",
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
        },
        required: ["owner", "repo"],
    },
};