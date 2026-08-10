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

export async function createIssue(
    owner: string,
    repo: string,
    title: string,
    body?: string
) {
    const response = await octokit.issues.create({
        owner,
        repo,
        title,
        body,
    });

    return {
        number: response.data.number,
        title: response.data.title,
        body: response.data.body,
        url: response.data.html_url,
    };
}

export async function listIssues(
    owner: string,
    repo: string
) {
    const response = await octokit.issues.listForRepo({
        owner,
        repo,
        state: "open",
    });

    return response.data.map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        url: issue.html_url,
    }));
}