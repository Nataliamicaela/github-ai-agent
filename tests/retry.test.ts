import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { retryWithBackoff } from "../src/utils/retry.js";

describe("retryWithBackoff", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("reintenta una operación cuando recibe un error 429", async () => {
        const rateLimitError = Object.assign(
            new Error("Too Many Requests"),
            { status: 429 }
        );

        const operation = vi
            .fn()
            .mockRejectedValueOnce(rateLimitError)
            .mockResolvedValueOnce("éxito");

        const promise = retryWithBackoff(operation, 3, 1000);

        await vi.advanceTimersByTimeAsync(1000);

        await expect(promise).resolves.toBe("éxito");
        expect(operation).toHaveBeenCalledTimes(2);
    });

    it("reintenta cuando el rate limit viene dentro de response.status", async () => {
        const rateLimitError = Object.assign(
            new Error("Forbidden"),
            {
                response: {
                    status: 403,
                },
            }
        );

        const operation = vi
            .fn()
            .mockRejectedValueOnce(rateLimitError)
            .mockResolvedValueOnce("éxito");

        const promise = retryWithBackoff(operation, 3, 1000);

        await vi.advanceTimersByTimeAsync(1000);

        await expect(promise).resolves.toBe("éxito");
        expect(operation).toHaveBeenCalledTimes(2);
    });

    it("aplica exponential backoff cuando la operación falla varias veces", async () => {
        const rateLimitError = Object.assign(
            new Error("Rate limit"),
            { status: 429 }
        );

        const operation = vi
            .fn()
            .mockRejectedValueOnce(rateLimitError)
            .mockRejectedValueOnce(rateLimitError)
            .mockResolvedValueOnce("éxito");

        const promise = retryWithBackoff(operation, 3, 1000);

        expect(operation).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(1000);

        expect(operation).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(2000);

        await expect(promise).resolves.toBe("éxito");
        expect(operation).toHaveBeenCalledTimes(3);
    });

    it("no reintenta errores que no sean de rate limiting", async () => {
        const error = Object.assign(
            new Error("Not Found"),
            { status: 404 }
        );

        const operation = vi.fn().mockRejectedValue(error);

        const promise = retryWithBackoff(operation, 3, 1000);

        await expect(promise).rejects.toBe(error);

        expect(operation).toHaveBeenCalledTimes(1);
    });

    it("lanza el error después de alcanzar el máximo de reintentos", async () => {
        const rateLimitError = Object.assign(
            new Error("Too Many Requests"),
            { status: 429 }
        );

        const operation = vi.fn().mockRejectedValue(rateLimitError);

        const promise = retryWithBackoff(operation, 2, 1000);

        const assertion = expect(promise).rejects.toBe(rateLimitError);

        await vi.advanceTimersByTimeAsync(1000);
        await vi.advanceTimersByTimeAsync(2000);

        await assertion;

        expect(operation).toHaveBeenCalledTimes(3);
    });
});