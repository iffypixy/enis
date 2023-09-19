import {IsString} from "class-validator";

export class LoginDto {
    @IsString()
    login: string;

    @IsString()
    password: string;
}

export class LoginQuery {
    city: string;
}
