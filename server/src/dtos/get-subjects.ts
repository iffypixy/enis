import {IsString} from "class-validator";

export class GetSubjectsQuery {
    @IsString()
    quarterId: string;
}
