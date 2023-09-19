import {Assessment, Quarter, SchoolYear, Subject} from "@shared/types";

const year = (y: SchoolYear) => ({
    id: y.Id,
    name: y.Name.replace(" учебный год", ""),
    actual: y.Data.IsActual,
});

const quarter = (q: Quarter) => ({
    id: q.Id,
});

const subject = (s: Subject) => ({
    id: s.Id,
    name: s.Name,
    score: s.Score,
    mark: s.Mark,
    journalId: s.JournalId,
    evaluationId: {
        forSection: s.Evaluations[0] && s.Evaluations[0].Id,
        forQuarter: s.Evaluations[1] && s.Evaluations[1].Id,
    },
});

const assessment = (a: Assessment) => ({
    id: a.Id,
    name: a.Name,
    score: a.Score,
    maxScore: a.MaxScore,
});

export const sanitize = {year, quarter, subject, assessment};
