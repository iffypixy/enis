import {Injectable, CanActivate, ExecutionContext} from "@nestjs/common";
import {Request} from "express";

@Injectable()
export class IsAuthenticated implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest() as Request;

        return !!request.session.account;
    }
}
