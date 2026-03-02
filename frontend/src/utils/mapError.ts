

export const getErrorMessage = (err: unknown): string => {
    if (
        typeof err === "object" &&
        err !== null &&
        "message" in err
    ) {
        const message = (err as { message: unknown }).message;

        if (Array.isArray(message)) return message.join(", ");
        if (typeof message === "string") return message;
    }
    return "Incorrect login or password";
};