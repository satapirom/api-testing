export const loginSchemaData = {
    type: "object",
    properties: {
        "token": { type: "string" },
    },
    required: ["token"]
}

export const loginSchemaDataFailed = {
    type: "object",
    properties: {
        "error": { type: "string" },
    },
    required: ["error"]
}