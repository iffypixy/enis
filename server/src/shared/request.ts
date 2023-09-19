import axios from "axios";

const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.3; x64; en-US) AppleWebKit/603.11 (KHTML, like Gecko) Chrome/51.0.1808.185 Safari/536";

export const request = axios.create({
    headers: {
        "User-Agent": USER_AGENT,
    },
});
