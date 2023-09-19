export const cookies = {
    stringToObject: (cookies: string): Record<string, string> => {
        const entries = cookies
            .split("; ")
            .filter((cookie) => !!cookie.length)
            .map((cookie) => cookie.split("="));

        return Object.fromEntries(entries);
    },
    objectToString: (object: Record<string, string>): string => {
        const entries = Object.entries(object);

        return entries.map((cookie) => cookie.join("=")).join("; ");
    },
    normalizeSetCookie: (cookies: string[]): string =>
        cookies.map((cookie) => cookie.split(";")[0]).join("; "),
};
