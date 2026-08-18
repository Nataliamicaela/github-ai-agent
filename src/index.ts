import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {
    CreateRepositoryInputSchema,
    CreateIssueInputSchema,
    ListIssuesInputSchema,
    ListPullRequestsInputSchema,
    CreatePullRequestInputSchema,
    CreateCommitInputSchema,
    SumInputSchema,
    SlugifyInputSchema,
} from "./schemas/index.js";

import {
    listRepositories,
    createRepository,
    createIssue,
    listIssues,
    listPullRequests,
    createPullRequest,
    createCommit,
} from "./github/operations.js";

import { transformGitHubError } from "./errors/handler.js";
import { ValidationError } from "./errors/index.js";

import { pingTool } from "./tools/ping.js";
import { sumTool } from "./tools/sum.js";
import { slugifyTool } from "./tools/slugify.js";
import { listRepositoriesTool } from "./tools/list-repositories.js";
import { createRepositoryTool } from "./tools/create-repository.js";
import { createIssueTool } from "./tools/create-issue.js";
import { listIssuesTool } from "./tools/list-issues.js";
import { listPullRequestsTool } from "./tools/list-pull-requests.js";
import { createPullRequestTool } from "./tools/create-pull-request.js";
import { createCommitTool } from "./tools/create-commit.js";

export const PingInputSchema = z.object({});

function validationErrorResponse(message: string) {
    const error = new ValidationError(message);

    return {
        content: [
            {
                type: "text" as const,
                text: error.message,
            },
        ],
        isError: true,
    };
}

function githubErrorResponse(context: string, error: unknown) {
    const transformedError = transformGitHubError(error);

    console.error(`[github] ${context}:`, transformedError.message);

    return {
        content: [
            {
                type: "text" as const,
                text: transformedError.message,
            },
        ],
        isError: true,
    };
}

async function main() {
    const server = new Server(
        {
            name: "github-ai-agent",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                pingTool,
                sumTool,
                slugifyTool,
                listRepositoriesTool,
                createRepositoryTool,
                createIssueTool,
                listIssuesTool,
                listPullRequestsTool,
                createPullRequestTool,
                createCommitTool,
            ],
        };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        if (name === "ping") {
            return {
                content: [
                    {
                        type: "text",
                        text: "pong",
                    },
                ],
            };
        }

        if (name === "sum") {
            const result = SumInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse("Los parámetros a y b deben ser números.");
            }

            const { a, b } = result.data;

            return {
                content: [
                    {
                        type: "text",
                        text: String(a + b),
                    },
                ],
            };
        }

        if (name === "slugify") {
            const result = SlugifyInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse("El parámetro text debe ser un string no vacío.");
            }

            const { text } = result.data;

            const slug = text
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-");

            return {
                content: [
                    {
                        type: "text",
                        text: slug,
                    },
                ],
            };
        }

        if (name === "list_repositories") {
            try {
                const repositories = await listRepositories();

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(repositories),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al listar repositorios", error);
            }
        }

        if (name === "create_repository") {
            const result = CreateRepositoryInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse(result.error.issues[0]?.message ?? "Los datos del repositorio no son válidos.");
            }

            try {
                const repository = await createRepository(
                    result.data.name,
                    result.data.description,
                    result.data.private
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(repository),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al crear repositorio", error);
            }
        }

        if (name === "create_issue") {
            const result = CreateIssueInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse(result.error.issues[0]?.message ?? "Los datos del issue no son válidos.");
            }

            try {
                const issue = await createIssue(
                    result.data.owner,
                    result.data.repo,
                    result.data.title,
                    result.data.body
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(issue),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al crear issue", error);
            }
        }

        if (name === "list_issues") {
            const result = ListIssuesInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse(result.error.issues[0]?.message ?? "Los datos del repositorio no son válidos.");
            }

            try {
                const issues = await listIssues(
                    result.data.owner,
                    result.data.repo
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(issues),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al listar issues", error);
            }
        }

        if (name === "list_pull_requests") {
            const result = ListPullRequestsInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse(result.error.issues[0]?.message ?? "Los datos del repositorio no son válidos.");
            }

            try {
                const pullRequests = await listPullRequests(
                    result.data.owner,
                    result.data.repo
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(pullRequests),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al listar Pull Requests", error);
            }
        }

        if (name === "create_pull_request") {
            const result = CreatePullRequestInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse(result.error.issues[0]?.message ?? "Los datos del Pull Request no son válidos.");
            }

            try {
                const pullRequest = await createPullRequest(
                    result.data.owner,
                    result.data.repo,
                    result.data.title,
                    result.data.body,
                    result.data.head,
                    result.data.base
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(pullRequest),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al crear Pull Request", error);
            }
        }

        if (name === "create_commit") {
            const result = CreateCommitInputSchema.safeParse(args);

            if (!result.success) {
                return validationErrorResponse(result.error.issues[0]?.message ?? "Los datos del commit no son válidos.");
            }

            try {
                const commit = await createCommit(
                    result.data.owner,
                    result.data.repo,
                    result.data.path,
                    result.data.message,
                    result.data.content,
                    result.data.branch,
                    result.data.sha
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(commit),
                        },
                    ],
                };
            } catch (error) {
                return githubErrorResponse("Error al crear commit", error);
            }
        }

        return {
            content: [
                {
                    type: "text",
                    text: `Tool no encontrada: ${name}`,
                },
            ],
            isError: true,
        };
    });

    const transport = new StdioServerTransport();

    await server.connect(transport);

    console.error("[mcp] GitHub AI Agent iniciado");
}

main().catch((error) => {
    console.error("[fatal]", error);
    process.exit(1);
});