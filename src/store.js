import {createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import { productReducer } from "./reducers/productReducer";

// const initialState = {};
// const composeEnhancer = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_ || compose;
// const store = createStore(combineReducers({
//     products: productReducer,
// }),
// initialState,
// composeEnhancer(applyMiddleware(thunk))
// );
//
const rootReducer = combineReducers({
    products: productReducer,
});
  
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  
  const store = createStore(rootReducer,
    composeEnhancer(applyMiddleware(thunk)),
  );
  
export default store;