import {
    AuthenticationError,
    GitHubAPIError,
    NetworkError,
} from "./index.js";

export function transformGitHubError(error: unknown): Error {
    if (error instanceof Error) {
        if (
            error.message.includes("401") ||
            error.message.toLowerCase().includes("bad credentials")
        ) {
            return new AuthenticationError(
                "Las credenciales de GitHub no son válidas. Verifica tu Personal Access Token."
            );
        }

        if (error.message.includes("404")) {
            return new GitHubAPIError(
                "El recurso solicitado no fue encontrado en GitHub.",
                404
            );
        }

        if (error.message.includes("403")) {
            return new GitHubAPIError(
                "GitHub rechazó la solicitud. Verifica los permisos del token o si se alcanzó el límite de solicitudes.",
                403
            );
        }

        if (
            error.message.toLowerCase().includes("network") ||
            error.message.toLowerCase().includes("fetch") ||
            error.message.toLowerCase().includes("socket")
        ) {
            return new NetworkError(
                "No fue posible comunicarse con GitHub. Verifica tu conexión e intenta nuevamente."
            );
        }
    }

    return new GitHubAPIError(
        "Ocurrió un error inesperado al comunicarse con GitHub."
    );
}