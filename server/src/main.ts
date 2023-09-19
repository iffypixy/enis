import {NestFactory} from "@nestjs/core";
import cookieParser from "cookie-parser";
import {ValidationPipe} from "@nestjs/common";

import {session} from "@shared/session";

import {AppModule} from "./module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            credentials: true,
            origin: process.env.CLIENT_URL,
        },
    });

    app.use(cookieParser());
    app.use(session());

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");

    await app.listen(8000);
}

bootstrap();
