import React from "react";
import { render } from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";
import { persistStore, autoRehydrate } from "redux-persist";
import * as Sentry from "@sentry/browser";
import { BrowserRouter as Router} from "react-router-dom";
import { SENTRY_DSN, ENVIRONMENT } from "./constants/global";
import App from "components/app/AppContainer";

import * as reducers from "./modules";
import "./index.scss";

/** Initialise Sentry */
if (ENVIRONMENT !== "development") {
  Sentry.init({
    dsn: SENTRY_DSN
  });
}

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  ...reducers
});

// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory();

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    autoRehydrate(),
    /* Redux dev tool, install chrome extension in
     * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en */
    typeof window === "object" && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

// Export dispatch funcion for dispatching actions outside connect
function dispatch(action) {
  store.dispatch(action);
}

const persistConfig = {
  whitelist: ["user", "app"]
};

function startApp() {
  render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById("app")
  );
}

persistStore(store, persistConfig, () => {
  startApp();
});

export { store, history, dispatch };
