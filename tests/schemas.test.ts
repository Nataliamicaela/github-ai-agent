import { describe, expect, it } from "vitest";

import {
    CreateRepositoryInputSchema,
    CreateIssueInputSchema,
} from "../src/schemas/index.js";

describe("CreateRepositoryInputSchema", () => {
    it("acepta un nombre de repositorio válido", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "mi-repositorio",
        });

        expect(result.success).toBe(true);
    });

    it("rechaza un nombre de repositorio menor a 3 caracteres", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "ab",
        });

        expect(result.success).toBe(false);
    });

    it("rechaza un nombre de repositorio mayor a 100 caracteres", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "a".repeat(101),
        });

        expect(result.success).toBe(false);
    });

    it("rechaza nombres con caracteres que GitHub no permite", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "mi repositorio!",
        });

        expect(result.success).toBe(false);
    });

    it("rechaza una descripción mayor a 500 caracteres", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "mi-repo",
            description: "a".repeat(501),
        });

        expect(result.success).toBe(false);
    });

    it("rechaza un valor de private que no sea booleano", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "mi-repo",
            private: "true",
        });

        expect(result.success).toBe(false);
    });

    it("acepta un repositorio privado con descripción", () => {
        const result = CreateRepositoryInputSchema.safeParse({
            name: "mi-repo",
            description: "Repositorio de prueba",
            private: true,
        });

        expect(result.success).toBe(true);
    });
});

describe("CreateIssueInputSchema", () => {
    const validIssue = {
        owner: "Nataliamicaela",
        repo: "github-ai-agent-test",
        title: "Issue de prueba",
        body: "Contenido del issue",
    };

    it("acepta los datos completos de un issue válido", () => {
        const result = CreateIssueInputSchema.safeParse(validIssue);

        expect(result.success).toBe(true);
    });

    it("acepta un issue sin body porque es opcional", () => {
        const result = CreateIssueInputSchema.safeParse({
            owner: validIssue.owner,
            repo: validIssue.repo,
            title: validIssue.title,
        });

        expect(result.success).toBe(true);
    });

    it("rechaza un issue sin owner", () => {
        const { owner, ...issueWithoutOwner } = validIssue;

        const result = CreateIssueInputSchema.safeParse(issueWithoutOwner);

        expect(result.success).toBe(false);
    });

    it("rechaza un issue sin repo", () => {
        const { repo, ...issueWithoutRepo } = validIssue;

        const result = CreateIssueInputSchema.safeParse(issueWithoutRepo);

        expect(result.success).toBe(false);
    });

    it("rechaza un issue sin título", () => {
        const { title, ...issueWithoutTitle } = validIssue;

        const result = CreateIssueInputSchema.safeParse(issueWithoutTitle);

        expect(result.success).toBe(false);
    });

    it("rechaza un título mayor a 256 caracteres", () => {
        const result = CreateIssueInputSchema.safeParse({
            ...validIssue,
            title: "a".repeat(257),
        });

        expect(result.success).toBe(false);
    });

    it("rechaza un body mayor a 10000 caracteres", () => {
        const result = CreateIssueInputSchema.safeParse({
            ...validIssue,
            body: "a".repeat(10001),
        });

        expect(result.success).toBe(false);
    });
});