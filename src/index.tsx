// @ts-nocheck (Error on Router)
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { persistStore } from "redux-persist";
import * as Sentry from "@sentry/browser";
import { BrowserRouter as Router } from "react-router-dom";
import { SENTRY_DSN, ENVIRONMENT } from "./constants/global";
import App from "components/app/AppContainer";
import "./index.scss";
import configureStore from "configureStore";

/** Initialise Sentry */
if (ENVIRONMENT !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN
  });
}
// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory();

// Redux store
const store = configureStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export dispatch function for dispatching actions outside connect
function dispatch(action: any) {
  store.dispatch(action);
}

const persistConfig = {
  whitelist: ["user", "app"]
};

function startApp() {
  const container = document.getElementById("app");
  const root = createRoot(container!);
  root.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
}

persistStore(store, persistConfig, () => {
  startApp();
});

export { store, history, dispatch };
