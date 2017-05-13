import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { hashHistory } from 'react-router';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import authRedirectMiddleware from './middlewares/auth-redirect';

import * as reducers from './modules';
import Routes from './routes';

import './index.css';

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
});

/**
 * Global state
 * @info(http://redux.js.org/docs/basics/Store.html)
 * @type {Object}
 */
const middlewareRouter = routerMiddleware(hashHistory);
const store = createStore(
  reducer,
  compose(
    /* The router middleware MUST be before thunk otherwise the URL changes
    * inside a thunk function won't work properly */
    applyMiddleware(middlewareRouter, thunk),
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
  whitelist: ['user']
};

/**
 * HTML5 History API managed by React Router module
 * @info(https://github.com/reactjs/react-router/tree/master/docs)
 * @type {Object}
 */
const history = syncHistoryWithStore(hashHistory, store);

function startApp() {
  render(
    <Provider store={store}>
      {/* Tell the Router to use our enhanced history */}
      <Routes history={history} />
    </Provider>,
    document.getElementById('app')
  );
}

persistStore(store, persistConfig, () => {
  startApp();
})


export { store, history, dispatch };

// Google Analytics
// process.env.NODE_ENV === 'production' && ReactGA.initialize(process.env.GA);
