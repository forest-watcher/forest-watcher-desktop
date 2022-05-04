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

const configureStore = () => createStore(reducer, compose(applyMiddleware(thunk), autoRehydrate()));

export default configureStore;
