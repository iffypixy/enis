const styles = {
    after: "after:w-full after:h-full after:rounded-full after:absolute after:border-[1rem] after:border-primary/30 after:animate-spin after:border-l-primary after:-right-[3rem]",
    before: "before:w-full before:h-full before:rounded-full before:absolute before:border-[1rem] before:border-primary/30 before:animate-spin-reverse before:border-r-primary before:-left-[3rem]",
};

export const BlockingLoader: React.FC = () => (
    <div className="w-screen h-screen fixed left-0 top-0 flex items-center justify-center bg-paper-primary opacity-[0.8] pointer-events-[all] z-50">
        <Loader />
    </div>
);

export const Loader: React.FC = () => (
    <div
        className={`relative w-[4rem] h-[4rem] ${styles.after} ${styles.before}} -left-[1.5rem]`}
    />
);
