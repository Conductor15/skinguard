export const addToCart = (id: string, info: any) => {
    return {
        type: "ADD_TO_CART",
        id: id,
        info: info
    };
}

export const updateQuantity = (id: string, quantity: number = 1) => {
    return {
        type: "UPDATE_QUANTITY",
        id: id,
        quantity: quantity
    };
}

export const removeFromCart = (id: string) => ({
  type: "REMOVE_FROM_CART",
  id,
});