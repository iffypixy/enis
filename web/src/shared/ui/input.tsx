import React from "react";
import {clsx} from "clsx";

type InputProps = React.ComponentProps<"input"> & {
    error?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({error, ...props}, ref) => (
        <input
            {...props}
            ref={ref}
            className={clsx(
                "w-full text-md font-semibold bg-paper-primary rounded-lg p-3 outline-none transition-shadow duration-200 focus:shadow-[0_0_0_2px_var(--primary-color),inset_0_0_0_2px_var(--primary-color)] hover:shadow-[0_0_0_1px_var(--primary-color),inset_0_0_0_1px_var(--primary-color)]",
                {
                    "border-error": error,
                },
            )}
        />
    ),
);
