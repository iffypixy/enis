import React from "react";
import {useForm} from "react-hook-form";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import {useMutation, useQuery} from "react-query";

import * as api from "@shared/api";
import {
    Input,
    Icon,
    Button,
    Modal,
    Center,
    BlockingLoader,
    Loader,
} from "@shared/ui";
import {schools} from "@shared/lib/schools";
import {Nullable, Subject, Term} from "@shared/lib/types";
import {getCurrentQuarter} from "@shared/lib/current-quarter";
import {emoticons} from "@shared/lib/emoticons";

import "swiper/css";
import "swiper/css/navigation";

export const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const {isLoading} = useQuery(
        ["isAuthenticated"],
        api.checkIfAuthenticated,
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            select: (res) => res.data,
            retry: false,
            onSuccess: (res) => {
                setIsAuthenticated(res.isAuthenticated);
            },
        },
    );

    if (isLoading) return <BlockingLoader />;

    if (!isAuthenticated)
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;

    return <Dashboard />;
};

const Dashboard: React.FC = () => {
    const [currentTermId, setCurrentTermId] =
        React.useState<Nullable<Term["id"]>>(null);

    const [currentQuarter, setCurrentQuarter] = React.useState(
        getCurrentQuarter(),
    );

    const [currentSubjectId, setCurrentSubjectId] =
        React.useState<Nullable<Subject["id"]>>(null);

    const termsResults = useQuery("terms", () => api.getTerms(), {
        staleTime: Infinity,
        select: (res) => res.data,
        onSuccess: (data) => {
            const term = data.terms.find((term) => term.actual)!;

            setCurrentTermId(term.id);
        },
    });

    const terms = termsResults.data?.terms;

    const quartersResults = useQuery(
        ["quarters", currentTermId],
        () => api.getQuarters({termId: currentTermId!}),
        {
            staleTime: Infinity,
            select: (res) => res.data,
            enabled: !!currentTermId,
        },
    );

    const quarters = quartersResults.data?.quarters;

    const currentQuarterId = quarters && quarters[currentQuarter].id;

    const subjectsResults = useQuery(
        ["subjects", currentQuarterId],
        () => api.getSubjects({quarterId: currentQuarterId!}),
        {
            staleTime: Infinity,

            select: (res) => res.data,
            enabled: !!currentQuarterId,
        },
    );

    const subjects = subjectsResults.data?.subjects;

    const currentSubject =
        subjects && subjects.find((s) => s.id === currentSubjectId);

    return (
        <>
            {currentSubject && (
                <SubjectModal
                    subject={currentSubject!}
                    isOpen={!!currentSubject}
                    onClose={() => setCurrentSubjectId(null)}
                />
            )}

            {(termsResults.isLoading || subjectsResults.isLoading) && (
                <BlockingLoader />
            )}

            <div className="w-full h-full bg-paper-primary">
                <header className="w-full bg-paper-secondary py-4 shadow-lg shadow-paper-secondary/30">
                    <div className="w-4/5 flex flex-row items-center justify-center mx-auto space-x-4">
                        <Logo />
                        <Title />
                    </div>
                </header>

                <main className="w-full space-y-6 p-6">
                    <div className="w-[55rem] xl:w-full space-y-6 mx-auto">
                        <div className="w-full">
                            {terms && (
                                <Swiper
                                    slidesPerView={3}
                                    modules={[Navigation]}
                                    navigation
                                    initialSlide={
                                        terms.length -
                                        terms.findIndex(
                                            (term) => term.id === currentTermId,
                                        )
                                    }
                                >
                                    {[...terms].reverse().map((term, idx) => (
                                        <SwiperSlide
                                            key={idx}
                                            className="flex items-center justify-center"
                                        >
                                            <div
                                                onClick={() => {
                                                    setCurrentTermId(term.id);
                                                }}
                                                className={twMerge(
                                                    clsx(
                                                        "text-paper-contrast/40 font-medium text-md cursor-pointer",
                                                        {
                                                            "text-primary":
                                                                currentTermId ===
                                                                term.id,
                                                        },
                                                    ),
                                                )}
                                            >
                                                {term.name}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        <div className="w-full flex justify-center">
                            {["I", "II", "III", "IV"].map((quarter, idx) => (
                                <div
                                    key={quarter}
                                    onClick={() => {
                                        setCurrentQuarter(idx);
                                    }}
                                    className={clsx(
                                        "w-[25%] h-14 flex justify-center items-center font-black text-xl text-paper-contrast/40 cursor-pointer transition-colors duration-300 hover:bg-paper-secondary/50",
                                        {
                                            "border-b-4 border-primary text-primary":
                                                idx === currentQuarter,
                                        },
                                    )}
                                >
                                    {quarter}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-[55rem] w-full flex flex-col items-center mx-auto space-y-2">
                        {subjectsResults.isError && (
                            <div className="w-full h-[60vh]">
                                <Center>
                                    <h4 className="bg-primary text-primary-contrast/75 p-8 shadow-even-lg shadow-primary rounded-xl font-black text-7xl cursor-default select-none border-primary-contrast border-4">
                                        {emoticons.random()}
                                    </h4>
                                </Center>
                            </div>
                        )}

                        {subjects &&
                            [...subjects]
                                .sort((a, b) => b.score - a.score)
                                .map((subject, idx) => {
                                    const detailed = String(
                                        subject.score,
                                    ).split(".");

                                    const ints = detailed[0];
                                    const decimals = detailed[1];

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() =>
                                                setCurrentSubjectId(subject.id)
                                            }
                                            className="w-full flex flex-row justify-between bg-paper-secondary rounded-md p-4 cursor-pointer transition-transform duration-300 hover:scale-105"
                                        >
                                            <div className="font-medium uppercase max-w-[60%] text-ellipsis overflow-hidden line-clamp-6">
                                                {subject.name}
                                            </div>

                                            <div className="flex flex-row">
                                                <span className="font-bold">
                                                    {ints}
                                                    {decimals && (
                                                        <span className="text-xs text-paper-contrast/70 font-normal">
                                                            .{decimals}
                                                        </span>
                                                    )}
                                                    %
                                                </span>

                                                <span className="font-bold">
                                                    &nbsp;/&nbsp;
                                                </span>

                                                <span className="font-black">
                                                    {subject.mark}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                    </div>
                </main>
            </div>
        </>
    );
};

interface SubjectModalProps extends React.ComponentProps<typeof Modal> {
    subject: Subject;
}

const SubjectModal: React.FC<SubjectModalProps> = ({subject, ...props}) => {
    const results = useQuery(
        ["assessments", subject.id],
        () =>
            api.getAssessments({
                sectionEvaluationId: subject.evaluationId.forSection!,
                quarterEvaluationId: subject.evaluationId.forQuarter!,
                journalId: subject.journalId,
            }),
        {
            select: (res) => res.data,
            enabled: !!(
                subject.evaluationId.forSection ||
                subject.evaluationId.forQuarter
            ),
        },
    );

    const forSection = results.data?.assessments.section;
    const forQuarter = results.data?.assessments.quarter;

    const isSectionDisabled = !!(forSection && forSection[0]?.score === -1);
    const isQuarterDisabled = !!(forQuarter && forQuarter[0]?.score === -1);

    const overall = {
        forSection:
            forSection &&
            `${forSection!.reduce(
                (prev, value) => prev + value.score,
                0,
            )}/${forSection!.reduce(
                (prev, value) => prev + value.maxScore,
                0,
            )}`,
        forQuarter:
            forQuarter &&
            `${forQuarter!.reduce(
                (prev, value) => prev + value.score,
                0,
            )}/${forQuarter!.reduce(
                (prev, value) => prev + value.maxScore,
                0,
            )}`,
    };

    const score = String(subject.score).split(".");

    return (
        <Modal {...props}>
            <div className="w-[45rem] flex flex-col justify-between bg-paper-primary rounded-lg p-4 space-y-4 shadow-paper-contrast/25 shadow-even-md">
                <div className="flex justify-between bg-paper-secondary p-4 rounded-md">
                    <div className="font-medium uppercase max-w-[75%] text-ellipsis overflow-hidden line-clamp-6">
                        {subject.name}
                    </div>

                    <div className="flex flex-row">
                        <span className="font-bold">
                            {score[0]}
                            {score[1] && (
                                <span className="text-xs text-paper-contrast/70 font-normal">
                                    .{score[1]}
                                </span>
                            )}
                            %
                        </span>

                        <span className="font-semibold">&nbsp;/&nbsp;</span>

                        <span className="font-black">{subject.mark}</span>
                    </div>
                </div>

                {results.isLoading && (
                    <Center>
                        <Loader />
                    </Center>
                )}

                {(forSection || forQuarter) && (
                    <>
                        <div className="bg-paper-secondary p-4 rounded-md space-y-4">
                            <div className="w-full flex justify-between">
                                <span className="font-extrabold">СОР</span>
                                <span className="font-extrabold">
                                    {isSectionDisabled
                                        ? "—/—"
                                        : overall.forSection}
                                </span>
                            </div>

                            <div className="flex flex-col space-y-1">
                                {forSection!.map((assessment) => (
                                    <div
                                        key={assessment.id}
                                        className="flex justify-between"
                                    >
                                        <span className="font-medium uppercase max-w-[75%] text-ellipsis overflow-hidden line-clamp-6">
                                            {assessment.name}
                                        </span>

                                        <span className="font-semibold">
                                            {isSectionDisabled
                                                ? "—/—"
                                                : `${assessment.score}/${assessment.maxScore}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-paper-secondary p-4 rounded-md space-y-4">
                            <div className="w-full flex justify-between">
                                <span className="font-extrabold">СОЧ</span>
                                <span className="font-extrabold">
                                    {isQuarterDisabled
                                        ? "—/—"
                                        : overall.forQuarter}
                                </span>
                            </div>

                            <div className="flex flex-col space-y-1">
                                {forQuarter!.map((assessment) => (
                                    <div
                                        key={assessment.id}
                                        className="flex justify-between"
                                    >
                                        <span className="font-medium uppercase max-w-[75%] text-ellipsis overflow-hidden line-clamp-6">
                                            {assessment.name}
                                        </span>

                                        <span className="font-semibold">
                                            {isQuarterDisabled
                                                ? "—/—"
                                                : `${assessment.score}/${assessment.maxScore}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

interface LoginForm {
    uin: string;
    password: string;
    cityId: string | null;
}

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
    const mutation = useMutation({
        mutationFn: api.login,
        onSuccess: props.onLogin,
    });

    const {formState, register, handleSubmit} = useForm<LoginForm>({
        defaultValues: {
            uin: "",
            password: "",
            cityId: null,
        },
    });

    const handleFormSubmit = handleSubmit((data) => {
        mutation.mutate({
            login: data.uin,
            password: data.password,
            city: data.cityId!,
        });
    });

    return (
        <>
            {mutation.isLoading && <BlockingLoader />}

            <div className="w-screen h-screen flex items-center justify-center">
                <div className="w-[25rem] flex flex-col items-center p-10 space-y-14 bg-paper-secondary rounded-xl shadow-even-md shadow-paper-contrast/25">
                    <div className="space-y-6 flex flex-col items-center">
                        <Logo />

                        <Title />
                    </div>

                    <form
                        className="w-full flex flex-col space-y-4"
                        onSubmit={handleFormSubmit}
                    >
                        <Input
                            className="placeholder:text-placeholder appearance-none"
                            type="number"
                            placeholder="Ваш ИИН"
                            error={!!formState.errors.uin?.message}
                            onKeyDown={(event) =>
                                event.key === "e" && event.preventDefault()
                            }
                            {...register("uin")}
                        />
                        <Input
                            className="placeholder:text-placeholder"
                            type="password"
                            placeholder="Ваш пароль"
                            error={!!formState.errors.password?.message}
                            {...register("password")}
                        />

                        <div className="relative">
                            <select
                                required
                                defaultValue=""
                                className="w-full text-md cursor-pointer text-paper-contrast font-semibold p-3 bg-paper-primary rounded-lg outline-none required:invalid:text-placeholder appearance-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_var(--primary-color),inset_0_0_0_2px_var(--primary-color)] hover:shadow-[0_0_0_1px_var(--primary-color),inset_0_0_0_1px_var(--primary-color)]"
                                {...register("cityId")}
                            >
                                <option disabled hidden value="">
                                    Ваша школа
                                </option>

                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>
                                        {school.label}
                                    </option>
                                ))}
                            </select>

                            <Icon.Down className="w-6 h-6 absolute right-[1rem] top-1/2 -translate-y-1/2" />
                        </div>

                        <Button className="w-full">Войти</Button>
                    </form>
                </div>
            </div>
        </>
    );
};

const Logo: React.FC = () => (
    <svg viewBox="0 0 300 300" fill="none" className="w-12 h-12 flex-none">
        <path
            className="fill-primary"
            d="M171.609 299.179C244.213 288.679 300 226.052 300 150.364C300 67.3203 232.843 0 150 0C82.0628 0 24.6744 45.2743 6.22249 107.367C14.4101 106.379 22.1125 106.43 26.7241 107.023C47.6567 110.291 67.2908 121.27 81.1884 137.201C81.7577 134.8 81.7503 132.323 81.7429 129.839C81.7371 127.884 81.7313 125.924 82.0071 123.995C83.4501 113.907 87.0763 103.434 92.3393 94.7143C111.111 63.6132 154.938 55.4171 185.531 73.0601C193.356 77.5728 200.531 83.8355 205.728 91.2695C207.303 93.5233 208.68 95.8665 210.045 98.1897C213.314 103.755 216.516 109.205 222.222 113.036C230.592 118.654 243.126 122.924 253.181 120.396C254.115 120.161 255.062 119.91 256.016 119.658C258.503 118.998 261.036 118.327 263.5 117.898C264.839 117.666 266.529 117.648 267.28 119.011C268.19 120.663 267.286 123.018 266.571 124.57C264.435 129.203 260.942 132.337 256.621 134.896C244.305 142.188 227.658 143.877 215.916 134.904C215.525 139.698 213.792 144.253 212.017 148.684C208.263 158.055 201.848 166.908 193.557 172.773C179.616 182.633 159.868 183.687 144.826 175.792C140.478 173.51 136.693 170.16 133.465 166.482C123.155 154.732 120.012 135.353 126.665 121.125C132.899 107.794 151.481 101.008 163.744 110.52C172.946 117.657 173.501 133.475 164.296 140.916C162.219 142.594 159.493 144.076 156.865 144.617C156.235 144.747 155.58 144.78 154.924 144.814C153.822 144.871 152.718 144.927 151.733 145.441C149.238 146.744 149.372 148.932 150.874 150.978C158.578 161.477 174.904 159.693 183.05 150.882C193.176 139.932 194.404 120.223 187.543 107.345C183.957 100.614 177.843 95.0824 171.198 91.4486C165.677 88.4298 158.029 85.7698 151.703 85.539C131.979 84.819 113.295 99.517 106.91 117.68C96.111 148.399 115.872 176.747 133.089 201.446C135.696 205.187 138.246 208.844 140.622 212.413C157.752 238.146 171.743 268.109 171.609 299.179Z"
        ></path>

        <path
            className="fill-primary"
            d="M135.145 300C59.2757 292.523 0 228.383 0 150.364C0 141.005 0.852919 131.846 2.48508 122.961C11.9133 125.574 21.1008 128.533 30.1639 132.446C44.9662 138.838 59.0352 147.209 71.4422 157.545C109.588 189.326 128.342 235.722 133.417 284.181C133.604 285.968 133.859 287.745 134.115 289.522C134.517 292.318 134.919 295.116 135.056 297.96C135.089 298.64 135.119 299.32 135.145 300Z"
        ></path>
    </svg>
);

const Title: React.FC = () => (
    <h3 className="text-4xl font-black">
        nis<span className="text-primary">x</span>
    </h3>
);
