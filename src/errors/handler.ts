import {
    AuthenticationError,
    GitHubAPIError,
    NetworkError,
} from "./index.js";

export function transformGitHubError(error: unknown): Error {
    if (error instanceof Error) {
        const githubError = error as Error & {
            status?: number;
            response?: {
                status?: number;
            };
        };

        const status =
            githubError.status ?? githubError.response?.status;

        if (status === 401) {
            return new AuthenticationError(
                "Las credenciales de GitHub no son válidas. Verifica tu Personal Access Token."
            );
        }

        if (status === 403) {
            return new GitHubAPIError(
                "GitHub rechazó la solicitud. Verifica los permisos del token o si se alcanzó el límite de solicitudes.",
                403
            );
        }

        if (status === 404) {
            return new GitHubAPIError(
                "El recurso solicitado no fue encontrado en GitHub.",
                404
            );
        }

        const message = error.message.toLowerCase();

        if (
            message.includes("network") ||
            message.includes("fetch") ||
            message.includes("socket") ||
            message.includes("econn")
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