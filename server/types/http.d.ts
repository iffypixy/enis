import {Session, SessionData} from "express-session";

declare module "http" {
    interface IncomingMessage {
        session: Session & SessionData;
    }
}
