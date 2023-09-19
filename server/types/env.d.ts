declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            SESSION_SECRET: string;
            REDIS_HOST: string;
            REDIS_PORT: string;
            CLIENT_URL: string;
        }
    }
}

export {};
