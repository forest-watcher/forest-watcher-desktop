import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { autoRehydrate } from "redux-persist";

import * as reducers from "./modules";
import "./index.scss";

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  ...reducers
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configureStore = () => createStore(reducer, composeEnhancers(applyMiddleware(thunk), autoRehydrate()));

export default configureStore;
