type ErrorEnvelope = { success: false; error: string };

function hasErrorEnvelope(data: unknown): data is ErrorEnvelope {
    return (
        typeof data === "object" &&
        data !== null &&
        (data as { success?: unknown }).success === false &&
        typeof (data as { error?: unknown }).error === "string"
    );
}

// RTK Query error shape varies (FetchBaseQueryError | SerializedError); this
// pulls the message out of our backend's { success: false, error } envelope.
export function getErrorMessage(err: unknown): string {
    const data =
        err && typeof err === "object" && "data" in err
            ? (err as { data?: unknown }).data
            : undefined;

    if (hasErrorEnvelope(data)) return data.error;
    return "Something went wrong. Please try again.";
}
