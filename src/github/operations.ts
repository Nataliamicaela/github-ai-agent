import { octokit } from "./client.js";

export async function listRepositories() {
    const response = await octokit.repos.listForAuthenticatedUser({
        visibility: "all",
        affiliation: "owner,collaborator,organization_member",
        per_page: 100,
    });

    return response.data.map((repo) => ({
        name: repo.name,
        description: repo.description,
        private: repo.private,
        url: repo.html_url,
    }));
}

export async function createRepository(
    name: string,
    description?: string,
    privateRepo?: boolean
) {
    const response = await octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: privateRepo ?? false,
    });

    return {
        name: response.data.name,
        full_name: response.data.full_name,
        private: response.data.private,
        html_url: response.data.html_url,
    };
}