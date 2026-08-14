import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    listForAuthenticatedUser: vi.fn(),
}));

vi.mock("../src/github/client.js", () => ({
    octokit: {
        repos: {
            listForAuthenticatedUser: mocks.listForAuthenticatedUser,
        },
    },
}));

import { listRepositories } from "../src/github/operations.js";

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
        mocks.listForAuthenticatedUser.mockResolvedValue({
            data: [],
        });

        await listRepositories();

        expect(mocks.listForAuthenticatedUser).toHaveBeenCalledWith({
            visibility: "all",
            affiliation: "owner,collaborator,organization_member",
            per_page: 100,
        });
    });

    it("devuelve un array vacío cuando GitHub no tiene repositorios", async () => {
        mocks.listForAuthenticatedUser.mockResolvedValue({
            data: [],
        });

        const result = await listRepositories();

        expect(result).toEqual([]);
    });
});