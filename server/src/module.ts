import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";

import {config} from "@shared/config";

import {AppController} from "./controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
            load: [config],
        }),
    ],
    controllers: [AppController],
})
export class AppModule {}
