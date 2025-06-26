import { Link } from "react-router-dom";
import "./style.scss";
import { useSelector } from "react-redux";
import { RootState

 } from "../../stores/Store";
const CartItem = () => {
    const cart = useSelector((state: RootState) => state.cart);

    const total = cart.reduce((sum, item) => {
        return sum + item.quantity;
    },0);
    return (
        <>
            <Link to="cart">
                <i className="fa-solid fa-cart-shopping cart-icon">
                <span>{total}</span>
            </i></Link>
        </>
    )
}

export default CartItem;