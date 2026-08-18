import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    listForAuthenticatedUser: vi.fn(),
    create: vi.fn(),
}));

vi.mock("../src/github/client.js", () => ({
    octokit: {
        repos: {
            listForAuthenticatedUser: mocks.listForAuthenticatedUser,
        },
        issues: {
            create: mocks.create,
        },
    },
}));

import { createIssue, listRepositories } from "../src/github/operations.js";

describe("listRepositories", () => {
    beforeEach(() => {
        mocks.listForAuthenticatedUser.mockReset();
    });

    it("devuelve los repositorios transformados correctamente", async () => {
        mocks.listForAuthenticatedUser.mockResolvedValue({
            data: [
                {
                    name: "repo-uno",
                    description: "Primer repositorio",
                    private: false,
                    html_url: "https://github.com/Nataliamicaela/repo-uno",
                },
                {
                    name: "repo-dos",
                    description: "Segundo repositorio",
                    private: true,
                    html_url: "https://github.com/Nataliamicaela/repo-dos",
                },
            ],
        });

        const result = await listRepositories();

        expect(result).toEqual([
            {
                name: "repo-uno",
                description: "Primer repositorio",
                private: false,
                url: "https://github.com/Nataliamicaela/repo-uno",
            },
            {
                name: "repo-dos",
                description: "Segundo repositorio",
                private: true,
                url: "https://github.com/Nataliamicaela/repo-dos",
            },
        ]);
    });

    it("envía a GitHub los parámetros esperados", async () => {
        mocks.listForAuthenticatedUser.mockResolvedValue({ data: [] });

        await listRepositories();

        expect(mocks.listForAuthenticatedUser).toHaveBeenCalledWith({
            visibility: "all",
            affiliation: "owner,collaborator,organization_member",
            per_page: 100,
        });
    });

    it("devuelve un array vacío cuando GitHub no tiene repositorios", async () => {
        mocks.listForAuthenticatedUser.mockResolvedValue({ data: [] });

        const result = await listRepositories();

        expect(result).toEqual([]);
    });
});

describe("createIssue", () => {
    beforeEach(() => {
        mocks.create.mockReset();
    });

    it("crea un issue y transforma la respuesta de GitHub", async () => {
        mocks.create.mockResolvedValue({
            data: {
                number: 42,
                title: "Bug de login",
                body: "El botón no responde",
                html_url: "https://github.com/Nataliamicaela/repo/issues/42",
            },
        });

        const result = await createIssue(
            "Nataliamicaela",
            "repo",
            "Bug de login",
            "El botón no responde"
        );

        expect(result).toEqual({
            number: 42,
            title: "Bug de login",
            body: "El botón no responde",
            url: "https://github.com/Nataliamicaela/repo/issues/42",
        });
    });

    it("envía a Octokit los parámetros esperados", async () => {
        mocks.create.mockResolvedValue({
            data: {
                number: 1,
                title: "Issue",
                body: "Body",
                html_url: "https://github.com/Nataliamicaela/repo/issues/1",
            },
        });

        await createIssue("Nataliamicaela", "repo", "Issue", "Body");

        expect(mocks.create).toHaveBeenCalledWith({
            owner: "Nataliamicaela",
            repo: "repo",
            title: "Issue",
            body: "Body",
        });
    });

    it("propaga el error de GitHub para que la capa MCP lo transforme", async () => {
        const error = Object.assign(new Error("Not Found"), { status: 404 });
        mocks.create.mockRejectedValue(error);

        await expect(
            createIssue("Nataliamicaela", "repo", "Issue")
        ).rejects.toBe(error);
    });
});
