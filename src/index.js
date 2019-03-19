import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import * as Sentry from '@sentry/browser';
import { SENTRY_DSN, ENVIRONMENT } from './constants/global';

import * as reducers from './modules';
import Routes from './routes';

import './index.css';

/** Initialise Sentry */
if (ENVIRONMENT !== 'development') {
  // eslint-disable-next-line
  console.log('sentry initialised')
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
const history = createHistory();

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    autoRehydrate(),
    /* Redux dev tool, install chrome extension in
     * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en */
    typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )
);

// Export dispatch funcion for dispatching actions outside connect
function dispatch(action) {
  store.dispatch(action);
}

const persistConfig = {
  whitelist: ['user', 'app']
};

function startApp() {
  render(
    <Provider store={store}>
      <Routes />
    </Provider>,
    document.getElementById('app')
  );
}

persistStore(store, persistConfig, () => {
  startApp();
});


export { store, history, dispatch };
