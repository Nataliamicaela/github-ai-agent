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
    SumInputSchema,
    SlugifyInputSchema,
} from "./schemas/index.js";

import {
    listRepositories,
    createRepository,
    createIssue,
    listIssues,
} from "./github/operations.js";

import { pingTool } from "./tools/ping.js";
import { sumTool } from "./tools/sum.js";
import { slugifyTool } from "./tools/slugify.js";
import { listRepositoriesTool } from "./tools/list-repositories.js";
import { createRepositoryTool } from "./tools/create-repository.js";
import { createIssueTool } from "./tools/create-issue.js";
import { listIssuesTool } from "./tools/list-issues.js";

export const PingInputSchema = z.object({});

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
                return {
                    content: [
                        {
                            type: "text",
                            text: "Los parámetros a y b deben ser números.",
                        },
                    ],
                    isError: true,
                };
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
                return {
                    content: [
                        {
                            type: "text",
                            text: "El parámetro text debe ser un string no vacío.",
                        },
                    ],
                    isError: true,
                };
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
                console.error(
                    "[github] Error al listar repositorios:",
                    error instanceof Error ? error.message : error
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: "No se pudieron obtener los repositorios de GitHub.",
                        },
                    ],
                    isError: true,
                };
            }
        }

        if (name === "create_repository") {
            const result = CreateRepositoryInputSchema.safeParse(args);

            if (!result.success) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Los datos del repositorio no son válidos.",
                        },
                    ],
                    isError: true,
                };
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
                console.error(
                    "[github] Error al crear repositorio:",
                    error instanceof Error ? error.message : error
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: "No se pudo crear el repositorio de GitHub.",
                        },
                    ],
                    isError: true,
                };
            }
        }

        if (name === "create_issue") {
            const result = CreateIssueInputSchema.safeParse(args);

            if (!result.success) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Los datos del issue no son válidos.",
                        },
                    ],
                    isError: true,
                };
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
                console.error(
                    "[github] Error al crear issue:",
                    error instanceof Error ? error.message : error
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: "No se pudo crear el issue de GitHub.",
                        },
                    ],
                    isError: true,
                };
            }
        }

        if (name === "list_issues") {
            const result = ListIssuesInputSchema.safeParse(args);

            if (!result.success) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Los datos del repositorio no son válidos.",
                        },
                    ],
                    isError: true,
                };
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
                console.error(
                    "[github] Error al listar issues:",
                    error instanceof Error ? error.message : error
                );

                return {
                    content: [
                        {
                            type: "text",
                            text: "No se pudieron obtener los issues de GitHub.",
                        },
                    ],
                    isError: true,
                };
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