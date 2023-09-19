import {IsString} from "class-validator";

export class GetAssessmentsQuery {
    @IsString()
    journalId: string;

    @IsString()
    sectionEvaluationId: string;

    @IsString()
    quarterEvaluationId: string;
}
