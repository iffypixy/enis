import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    Session,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import {Request, Response} from "express";
import {SessionWithData} from "express-session";

import {sanitize} from "@shared/sanitize";
import {cookies} from "@shared/cookies";
import {request} from "@shared/request";
import {
    ServerResponse,
    GetQuartersResponse,
    GetYearsResponse,
    GetParallelsResponse,
    GetClassesResponse,
    GetStudentsResponse,
    GetDiaryResponse,
    GetSubjectsResponse,
    GetAssessmentResponse,
} from "@shared/types";

import * as dtos from "./dtos";
import {IsAuthenticated} from "./guards";

const url = (city: string) => `https://sms.${city}.nis.edu.kz`;

const exception = (res: ServerResponse<any>) => {
    const UNAUTHORIZED = [
        "Сессия пользователя была завершена, перезагрузите страницу",
        "Текущая сессия завершена по причине входа с другой рабочей станции",
    ];

    if (UNAUTHORIZED.some((message) => res.message.includes(message)))
        return new UnauthorizedException("Wrong credentials");

    return new BadRequestException("Something went wrong");
};

@Controller()
export class AppController {
    @UseGuards(IsAuthenticated)
    @Get("auth/check")
    checkIfAuthenticated() {
        return {
            isAuthenticated: true,
        };
    }

    @UseGuards(IsAuthenticated)
    @Post("auth/refresh")
    async refresh(
        @Session() session: SessionWithData,
        @Res({passthrough: true}) res: Response,
    ) {
        const body = {
            login: session.account!.login,
            password: session.account!.password,
            captchaInput: "",
            twoFactorAuthCode: "",
            application2FACode: "",
        };

        const {data, headers} = await request.post<ServerResponse<void>>(
            "/root/Account/LogOn",
            body,
            {
                baseURL: url(session.city!),
            },
        );

        const {success} = data;

        if (!success) throw exception(data);

        const cookiesObject = cookies.stringToObject(
            cookies.normalizeSetCookie(headers["set-cookie"]!),
        );

        for (const key in cookiesObject) {
            res.cookie(key, cookiesObject[key]);
        }
    }

    @Post("login")
    async login(
        @Session() session: SessionWithData,
        @Body() dto: dtos.LoginDto,
        @Query() query: dtos.LoginQuery,
        @Res({passthrough: true}) res: Response,
    ) {
        const body = {
            login: dto.login,
            password: dto.password,
            captchaInput: "",
            twoFactorAuthCode: "",
            application2FACode: "",
        };

        const {data, headers} = await request.post<ServerResponse<void>>(
            "/root/Account/LogOn",
            body,
            {
                baseURL: url(query.city),
            },
        );

        const {success} = data;

        if (!success) throw exception(data);

        session.account = {
            login: dto.login,
            password: dto.password,
        };

        session.city = query.city;

        const cookiesObject = cookies.stringToObject(
            cookies.normalizeSetCookie(headers["set-cookie"]!),
        );

        for (const key in cookiesObject) {
            res.cookie(key, cookiesObject[key]);
        }

        return {
            login: dto.login,
            password: dto.password,
        };
    }

    @UseGuards(IsAuthenticated)
    @Get("terms")
    async getTerms(@Req() req: Request, @Session() session: SessionWithData) {
        const {data} = await request.post<ServerResponse<GetYearsResponse>>(
            "/Ref/GetSchoolYears",
            {},
            {
                baseURL: url(session.city!),
                headers: {
                    Cookie: cookies.objectToString(req.cookies),
                },
            },
        );

        const {data: terms, success} = data;

        if (!success) throw exception(data);

        return {terms: terms.map(sanitize.year)};
    }

    @UseGuards(IsAuthenticated)
    @Get("quarters")
    async getQuarters(
        @Req() req: Request,
        @Query() query: dtos.GetQuartersQuery,
        @Session() session: SessionWithData,
    ) {
        const {data} = await request.post<ServerResponse<GetQuartersResponse>>(
            "/Ref/GetPeriods",
            {
                schoolYearId: query.termId,
            },
            {
                baseURL: url(session.city!),
                headers: {
                    Cookie: cookies.objectToString(req.cookies),
                },
            },
        );

        const {data: quarters, success} = data;

        if (!success) throw exception(data);

        return {
            quarters: quarters.map(sanitize.quarter),
        };
    }

    @UseGuards(IsAuthenticated)
    @Get("subjects")
    async getSubjects(
        @Req() req: Request,
        @Res({passthrough: true}) res: Response,
        @Query() query: dtos.GetSubjectsQuery,
        @Session() session: SessionWithData,
    ) {
        const options = {
            baseURL: url(session.city!),
            headers: {
                Cookie: cookies.objectToString(req.cookies),
            },
        };

        const {data: parallelsData} = await request.post<
            ServerResponse<GetParallelsResponse>
        >(
            "/JceDiary/GetParallels",
            {
                periodId: query.quarterId,
            },
            options,
        );

        const {data: parallels} = parallelsData;

        if (!parallels) throw exception(parallelsData);

        const parallelId = parallels[0].Id;

        const {data: classesData} = await request.post<
            ServerResponse<GetClassesResponse>
        >(
            "/JceDiary/GetKlasses",
            {
                periodId: query.quarterId,
                parallelId,
            },
            options,
        );

        const {data: classes} = classesData;

        if (!classes) throw exception(classesData);

        const classId = classes[0].Id;

        const {data: studentsData} = await request.post<
            ServerResponse<GetStudentsResponse>
        >(
            "/JceDiary/GetStudents",
            {
                periodId: query.quarterId,
                klassId: classId,
            },
            options,
        );

        const {data: students} = studentsData;

        if (!students) throw exception(studentsData);

        const studentId = students[0].Id;

        const {data: diaryData} = await request.post<
            ServerResponse<GetDiaryResponse>
        >(
            "/JceDiary/GetJceDiary",
            {
                periodId: query.quarterId,
                parallelId,
                klassId: classId,
                studentId,
            },
            options,
        );

        const {data: diaryResults} = diaryData;

        if (!diaryResults) throw exception(diaryData);

        const diaryURL = diaryResults.Url;

        const {
            headers: {"set-cookie": diarySetCookie},
        } = await request.get(diaryURL, {headers: options.headers});

        const setCookieString = cookies.normalizeSetCookie(diarySetCookie!);
        const setCookieObject = cookies.stringToObject(setCookieString);

        for (const key in setCookieObject) {
            res.cookie(key, setCookieObject[key]);
        }

        options.headers.Cookie += `; ${setCookieString}`;

        const {data: subjectsData} = await request.post<
            ServerResponse<GetSubjectsResponse>
        >("/Jce/Diary/GetSubjects", {}, options);

        const {data: subjects} = subjectsData;

        if (!subjects) throw exception(subjectsData);

        return {subjects: subjects.map(sanitize.subject)};
    }

    @UseGuards(IsAuthenticated)
    @Get("assessments")
    async getAssessments(
        @Query() query: dtos.GetAssessmentsQuery,
        @Req() req: Request,
        @Session() session: SessionWithData,
    ) {
        const options = {
            headers: {
                Cookie: cookies.objectToString(req.cookies),
            },
            baseURL: url(session.city!),
        };

        const {data: dataForSection} = await request.post<
            ServerResponse<GetAssessmentResponse>
        >(
            "/Jce/Diary/GetResultByEvalution",
            {
                journalId: query.journalId,
                evalId: query.sectionEvaluationId,
            },
            options,
        );

        const {data: forSection} = dataForSection;

        if (!forSection) throw exception(dataForSection);

        const {data: dataForQuarter} = await request.post<
            ServerResponse<GetAssessmentResponse>
        >(
            "/Jce/Diary/GetResultByEvalution",
            {
                journalId: query.journalId,
                evalId: query.quarterEvaluationId,
            },
            options,
        );

        const {data: forQuarter} = dataForQuarter;

        if (!forQuarter) throw exception(dataForQuarter);

        return {
            assessments: {
                section: forSection.map(sanitize.assessment),
                quarter: forQuarter.map(sanitize.assessment),
            },
        };
    }
}
