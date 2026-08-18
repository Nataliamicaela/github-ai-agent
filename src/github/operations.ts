import { octokit } from "./client.js";
import { retryWithBackoff } from "../utils/retry.js";

export async function listRepositories() {
    const response = await retryWithBackoff(() =>
        octokit.repos.listForAuthenticatedUser({
            visibility: "all",
            affiliation: "owner,collaborator,organization_member",
            per_page: 100,
        })
    );

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
    const response = await retryWithBackoff(() =>
        octokit.repos.createForAuthenticatedUser({
            name,
            description,
            private: privateRepo ?? false,
        })
    );

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
    const response = await retryWithBackoff(() =>
        octokit.issues.create({
            owner,
            repo,
            title,
            body,
        })
    );

    return {
        number: response.data.number,
        title: response.data.title,
        body: response.data.body,
        url: response.data.html_url,
    };
}

export async function listIssues(owner: string, repo: string) {
    const response = await retryWithBackoff(() =>
        octokit.issues.listForRepo({
            owner,
            repo,
            state: "open",
        })
    );

    return response.data.map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        url: issue.html_url,
    }));
}

export async function listPullRequests(owner: string, repo: string) {
    const response = await retryWithBackoff(() =>
        octokit.pulls.list({
            owner,
            repo,
            state: "open",
        })
    );

    return response.data.map((pullRequest) => ({
        number: pullRequest.number,
        title: pullRequest.title,
        body: pullRequest.body,
        url: pullRequest.html_url,
    }));
}

export async function createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string | undefined,
    head: string,
    base: string
) {
    const response = await retryWithBackoff(() =>
        octokit.pulls.create({
            owner,
            repo,
            title,
            body,
            head,
            base,
        })
    );

    return {
        number: response.data.number,
        title: response.data.title,
        body: response.data.body,
        url: response.data.html_url,
    };
}

export async function createCommit(
    owner: string,
    repo: string,
    path: string,
    message: string,
    content: string,
    branch?: string,
    sha?: string
) {
    const response = await retryWithBackoff(() =>
        octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message,
            content: Buffer.from(content, "utf-8").toString("base64"),
            branch,
            sha,
        })
    );

    return {
        commit_sha: response.data.commit.sha,
        commit_url: response.data.commit.html_url,
        file_path: response.data.content?.path,
    };
}
