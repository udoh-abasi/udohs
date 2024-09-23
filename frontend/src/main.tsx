import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./reduxFiles/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a react-query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Wrap everything with 'Provider', so that redux store will be available for all the app */}
    <Provider store={store}>
      {/* Wrap the app with the 'QueryClientProvider' to provide react query context to the app */}
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
