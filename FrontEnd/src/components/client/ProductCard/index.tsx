import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    id: string;
    image: string;
    title: string;
    price: number;
    description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, image, title, price, description }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products/${id}`);
    };
    return (
        <div className="cart__item" onClick={handleClick}>
            <img src={image} alt="" />
            <div className="cart__item__info">
                <h2>{title}</h2>
                <div className="cart__item__price">
                    {price}$
                </div>
                <p>{description}</p>
                <div className="cart__item__actions">
                    <button className="cart__item__actions__add">Add to cart</button>
                    <button className="cart__item__actions__buy">Buy now</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
