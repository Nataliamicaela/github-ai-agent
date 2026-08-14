import { describe, expect, it } from "vitest";

import { transformGitHubError } from "../src/errors/handler.js";
import {
    AuthenticationError,
    GitHubAPIError,
    NetworkError,
} from "../src/errors/index.js";

describe("transformGitHubError", () => {
    it("transforma un error 401 en AuthenticationError", () => {
        const error = Object.assign(new Error("Bad credentials"), {
            status: 401,
        });

        const result = transformGitHubError(error);

        expect(result).toBeInstanceOf(AuthenticationError);
        expect(result.message).toBe(
            "Las credenciales de GitHub no son válidas. Verifica tu Personal Access Token."
        );
    });

    it("transforma un error 403 en GitHubAPIError con status 403", () => {
        const error = Object.assign(new Error("Forbidden"), {
            status: 403,
        });

        const result = transformGitHubError(error);

        expect(result).toBeInstanceOf(GitHubAPIError);
        expect(result.message).toBe(
            "GitHub rechazó la solicitud. Verifica los permisos del token o si se alcanzó el límite de solicitudes."
        );
        expect((result as GitHubAPIError).status).toBe(403);
    });

    it("transforma un error 404 en GitHubAPIError con status 404", () => {
        const error = Object.assign(new Error("Not Found"), {
            status: 404,
        });

        const result = transformGitHubError(error);

        expect(result).toBeInstanceOf(GitHubAPIError);
        expect(result.message).toBe(
            "El recurso solicitado no fue encontrado en GitHub."
        );
        expect((result as GitHubAPIError).status).toBe(404);
    });

    it("transforma un error de red en NetworkError", () => {
        const error = new Error("Network request failed");

        const result = transformGitHubError(error);

        expect(result).toBeInstanceOf(NetworkError);
        expect(result.message).toBe(
            "No fue posible comunicarse con GitHub. Verifica tu conexión e intenta nuevamente."
        );
    });

    it("transforma un error desconocido en GitHubAPIError genérico", () => {
        const error = new Error("Something unexpected happened");

        const result = transformGitHubError(error);

        expect(result).toBeInstanceOf(GitHubAPIError);
        expect(result.message).toBe(
            "Ocurrió un error inesperado al comunicarse con GitHub."
        );
    });
});