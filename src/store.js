import {createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import { productsReducer } from "./reducers/productReducers";

// const initialState = {};
// const composeEnhancer = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
// const store = createStore(combineReducers({
//     products: productsReducer,
// }),
// initialState,
// composeEnhancer(applyMiddleware(thunk))
// );
//
const rootReducer = combineReducers({
    products: productsReducer,
});
  
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  
  const store = createStore(rootReducer,
    composeEnhancer(applyMiddleware(thunk)),
  );
  
export default store;