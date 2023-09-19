type FullscreenProps = React.ComponentProps<"div">;

export const Fullscreen: React.FC<FullscreenProps> = (props) => (
    <div {...props} className="w-screen h-screen">
        {props.children}
    </div>
);
