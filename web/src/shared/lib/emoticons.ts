const collection = [
    "(ノ_<。)",
    "(μ_μ)",
    "o(TヘTo)",
    "≧◉◡◉≦",
    "(｡•́︿•̀｡)",
    "( ╥ω╥ )",
];

const random = () => {
    const index = Math.floor(Math.random() * collection.length);

    return collection[index];
};

export const emoticons = {collection, random};
