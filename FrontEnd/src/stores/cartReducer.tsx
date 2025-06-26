import { AnyAction } from "redux";

export interface CartItem {
  id: string;
  info: any;
  quantity: number;
}

const initialState: CartItem[] = [];

const CartReducer = (state = initialState, action: AnyAction): CartItem[] => {
  const newState = [...state];

  switch (action.type) {
    case "ADD_TO_CART":
      return [
        ...state,
        {
          id: action.id,
          info: action.info,
          quantity: 1,
        },
      ];

    case "UPDATE_QUANTITY":
      return state.map(item =>
        item.id === action.id
          ? { ...item, quantity: action.quantity }
          : item
      );

    case "REMOVE_FROM_CART":
      return state.filter(item => item.id !== action.id);

    default:
      return state;
  }
};

export default CartReducer;
