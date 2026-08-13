export const createCommitTool = {
    name: "create_commit",
    description:
        "Crea o modifica un archivo en un repositorio de GitHub y genera un commit con el contenido indicado.",
    inputSchema: {
        type: "object",
        properties: {
            owner: {
                type: "string",
                description: "Usuario u organización propietaria del repositorio.",
            },
            repo: {
                type: "string",
                description: "Nombre del repositorio donde se realizará el commit.",
            },
            path: {
                type: "string",
                description:
                    "Ruta del archivo que se quiere crear o modificar, por ejemplo: docs/notas.md.",
            },
            message: {
                type: "string",
                description: "Mensaje descriptivo del commit.",
            },
            content: {
                type: "string",
                description: "Contenido completo que tendrá el archivo.",
            },
            branch: {
                type: "string",
                description:
                    "Rama donde se realizará el commit. Si no se indica, GitHub utilizará la rama predeterminada.",
            },
            sha: {
                type: "string",
                description:
                    "SHA del archivo existente. Es necesario cuando se quiere modificar un archivo existente.",
            },
        },
        required: ["owner", "repo", "path", "message", "content"],
    },
};