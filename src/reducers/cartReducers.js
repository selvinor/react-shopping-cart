import { ADD_TO_CART, REMOVE_FROM_CART } from "../types";
const cartItems = ( localStorage.getItem("cartItems") !== 'undefined') ? localStorage.getItem("cartItems") : [];
console.log(' localStorage.getItem("cartItems")',  localStorage.getItem("cartItems"));
console.log('cartReducers cartItems:', cartItems);
console.log('cartItems.length:', cartItems.length);
export const cartReducer = (
   
//   state = { cartItems: JSON.parse(localStorage.getItem("cartItems") || "[]") },
  state = { cartItems: cartItems.length > 0 ? JSON.parse(cartItems): [] },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { cartItems: action.payload.cartItems };
    case REMOVE_FROM_CART:
      return { cartItems: action.payload.cartItems };
    default:
      return state;
  }
};
