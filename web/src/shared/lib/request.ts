import axios from "axios";

import * as api from "@shared/api";

export const request = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

const UNAUTHORIZED = 401;

request.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        if (status === UNAUTHORIZED) {
            await api.refresh();

            return request(error.config);
        }

        return Promise.reject(error);
    },
);
