import s from "express-session";
import Store from "connect-redis";
import Redis from "ioredis";

import {config} from "@shared/config";

const month = 2629800000;

export const session = () => {
    const redis = new Redis();

    const store = new Store({client: redis});

    return s({
        secret: config().session.secret,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store,
        cookie: {
            maxAge: month,
            httpOnly: true,
        },
    });
};
