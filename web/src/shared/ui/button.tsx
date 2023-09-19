import React from "react";
import {clsx} from "clsx";

type ButtonProps = React.ComponentProps<"button">;

export const Button: React.FC<ButtonProps> = ({
    className,
    children,
    ...props
}) => (
    <button
        {...props}
        className={clsx(
            "font-bold text-lg uppercase bg-primary text-primary-contrast rounded-md cursor-pointer hover:shadow-primary px-8 py-3 transition duration-300 hover:-translate-y-1 hover:shadow-2xl",
            className,
        )}
    >
        {children}
    </button>
);
