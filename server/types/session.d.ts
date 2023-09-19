import "express-session";

import {Maybe} from "@shared/types";

declare module "express-session" {
    interface SessionData {
        account: Maybe<{
            login: string;
            password: string;
        }>;
        city: Maybe<string>;
    }

    export type SessionWithData = Session & SessionData;
}
