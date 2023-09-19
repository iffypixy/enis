import {IsString} from "class-validator";

export class GetQuartersQuery {
    @IsString()
    termId: string;
}
