// Define the schema before using it
export const createUserSchemaData = {
    type: "object",
    properties: {
        name: { type: "string" },
        job: { type: "string" },
        id: { type: "string" },
        createdAt: { type: "string" }  // Changed from integer to string
    },
    required: ["name", "job", "id", "createdAt"]
};