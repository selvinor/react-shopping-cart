import { FETCH_PRODUCTS } from "../types";

export const productReducer = (state = {}, action) =>{
    console.log('reducer action.payload: ', action.payload);
    switch (action.type){
        case FETCH_PRODUCTS:
            return { items: action.payload };
        default:
            return state;
    }
}