import store from "store";
// @ts-nocheck (Error on Router)
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { persistStore } from "redux-persist";
import * as Sentry from "@sentry/browser";
import { BrowserRouter as Router } from "react-router-dom";
import { SENTRY_DSN, ENVIRONMENT } from "./constants/global";
import App from "components/app/AppContainer";
import "./main.css";
import "./index.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/** Initialise Sentry */
if (ENVIRONMENT !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN
  });
}
// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory();

// Export dispatch function for dispatching actions outside connect
function dispatch(action: any) {
  store.dispatch(action);
}

const persistConfig = {
  whitelist: ["user", "app"]
};

const queryClient = new QueryClient();

function startApp() {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </QueryClientProvider>
  );
}

persistStore(store, persistConfig, () => {
  startApp();
});

export { store, history, dispatch };
