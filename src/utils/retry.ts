export async function retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<T> {
    let attempt = 0;

    while (true) {
        try {
            return await operation();
        } catch (error) {
            if (attempt >= maxRetries || !isRateLimitError(error)) {
                throw error;
            }

            const delay = initialDelay * Math.pow(2, attempt);

            console.error(
                `[retry] Rate limit detectado. Reintentando en ${delay}ms...`
            );

            await wait(delay);
            attempt++;
        }
    }
}

function isRateLimitError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    const githubError = error as Error & {
        status?: number;
        response?: {
            status?: number;
            headers?: Record<string, string | number | undefined>;
        };
        headers?: Record<string, string | number | undefined>;
    };

    const status = githubError.status ?? githubError.response?.status;

    if (status === 429) {
        return true;
    }

    if (status !== 403) {
        return false;
    }

    const headers = githubError.response?.headers ?? githubError.headers;
    const remaining = headers?.["x-ratelimit-remaining"];
    const retryAfter = headers?.["retry-after"];

    return remaining === "0" || remaining === 0 || retryAfter !== undefined;
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
