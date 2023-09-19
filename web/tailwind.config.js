export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            body: "Rubik, sans-serif",
        },
        extend: {
            keyframes: {
                spin: {
                    "0%": {transform: "rotate(0deg)"},
                    "50%, 100%": {transform: "rotate(360deg)"},
                },
            },
            animation: {
                spin: "spin 0.5s linear infinite",
                "spin-reverse": "spin 0.5s linear infinite reverse",
            },
            boxShadow: f({
                even: {
                    md: "0 0 25px rgb(0 0 0 / 0.1)",
                    lg: "0 0 30px 5px rgb(0 0 0 / 0.1)",
                },
            }),
            colors: {
                primary: {
                    DEFAULT: "rgb(var(--primary-color) / <alpha-value>)",
                    contrast: "var(--primary-color-contrast)",
                },
                secondary: {
                    DEFAULT: "var(--secondary-color)",
                    contrast: "var(--secondary-color-contrast)",
                },
                accent: {
                    DEFAULT: "var(--accent-color)",
                    contrast: "var(--accent-color-contrast)",
                },
                success: {
                    DEFAULT: "var(--success-color)",
                },
                error: {
                    DEFAULT: "var(--error-color)",
                },
                paper: {
                    primary: "rgb(var(--paper-primary) / <alpha-value>)",
                    secondary: "rgb(var(--paper-secondary) / <alpha-value>)",
                    contrast: "rgb(var(--paper-contrast) / <alpha-value>)",
                },
                placeholder: "var(--placeholder)",
            },
        },
        screens: {
            "2xl": {
                max: "1632px",
            },
            xl: {
                max: "1344px",
            },
            lg: {
                max: "1056px",
            },
            md: {
                max: "768px",
            },
            sm: {
                max: "480px",
            },
        },
    },
    plugins: [],
};

function f(theme) {
    const flat = {};

    function recurse(object, prefix = "") {
        for (const prop in object) {
            if (typeof object[prop] === "object") {
                recurse(object[prop], `${prefix}${prop}-`);
            } else {
                const key = `${prefix}${prop}`;

                flat[key] = object[prop];
            }
        }
    }

    recurse(theme);

    return flat;
}
