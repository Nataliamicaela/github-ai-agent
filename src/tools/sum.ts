export const sumTool = {
    name: "sum",
    description: "Suma dos números y devuelve el resultado.",
    inputSchema: {
        type: "object",
        properties: {
            a: {
                type: "number",
                description: "Primer número",
            },
            b: {
                type: "number",
                description: "Segundo número",
            },
        },
        required: ["a", "b"],
    },
};