import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../stores/Store";
import { updateQuantity, removeFromCart  } from "../../components/actions/cart";
import "./style.scss";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.info.price, 0);

  const handleIncrease = (id: string, quantity: number) => {
    dispatch(updateQuantity(id, quantity + 1));
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity > 1) {
      dispatch(updateQuantity(id, quantity - 1));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleOrder = () => {
    alert("Đặt hàng thành công!");

  };

  return (
    <div className="cart-container">
      <h2>Giỏ hàng ({totalItems} sản phẩm)</h2>

      {cart.length === 0 ? (
        <p className="empty">Không có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.info.image} alt={item.info.title} />
                <div className="item-details">
                  <h3>{item.info.title}</h3>
                  <p>{item.info.description}</p>
                  <div className="item-meta">
                    <div className="quantity-controls">
                      <button onClick={() => handleDecrease(item.id, item.quantity)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id, item.quantity)}>+</button>
                    </div>
                    <span>Giá: {item.info.price}$</span>
                    <span>Tổng: {item.quantity * item.info.price}$</span>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <strong>Tổng cộng: {totalPrice}$</strong>
            <button className="order-btn" onClick={handleOrder}>Đặt hàng</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
