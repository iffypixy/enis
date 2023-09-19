type CenterProps = React.ComponentProps<"div">;

export const Center: React.FC<CenterProps> = (props) => (
    <div {...props} className="w-full h-full flex justify-center items-center">
        {props.children}
    </div>
);
