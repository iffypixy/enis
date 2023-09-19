import ReactDOM from "react-dom/client";
import {QueryClient, QueryClientProvider} from "react-query";

import {App} from "./app";

import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}},
});

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
);
