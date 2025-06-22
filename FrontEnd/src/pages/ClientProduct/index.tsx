import { useState, useEffect } from "react";
import "./style.scss";
import ProductCard from "../../components/client/ProductCard";

type Product = {
    _id: string;
    product_id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    availability: boolean;
    sold_count: number;
    createdAt: string;
    updatedAt: string;
};


const ClientProduct = () => {
    const [data, setData] = useState<Product[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/product")
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
    }, [])

    const [openFilter, setOpenFilter] = useState(false);
    const [filterSelected, setFilterSelected] = useState("All")

    const [openSort, setOpenSort] = useState(false);
    const [sortSelected, setSortSelected] = useState("Giá tăng dần")

    const categories = [
        "All",     // All Categories
        "nv",      // Melanocytic nevi
        "mel",     // Melanoma
        "bkl",     // Benign keratosis-like lesions
        "bcc",     // Basal cell carcinoma
        "akiec",   // Actinic keratoses
        "vasc",    // Vascular lesions
        "df"       // Dermatofibroma
    ];



    const sorts = [
        "Giá tăng dần",
        "Giá giảm dần",
    ]

    const filteredAndSortedData = data
    .filter((item) => {
        if (filterSelected === "All") return true;
        return item.description.toLowerCase().includes(filterSelected.toLowerCase());
    })
    
    .sort((a, b) => {
        if (sortSelected === "Giá tăng dần") return a.price - b.price;
        if (sortSelected === "Giá giảm dần") return b.price - a.price;
        return 0;
    });


    return (
        <>
            <div className="product_container">
                <h2>Product List</h2>
                <div className="controls">
                    <div className="controls__search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search products..." />
                    </div>
                    <div className="controls__filter">
                        <div className="controls__filter__selected" onClick={()=> {setOpenFilter(!openFilter); setOpenSort(false)}}>
                            <p>{filterSelected}</p>
                            <i className="fa-solid fa-filter"></i>
                        </div>
                        {
                            openFilter && <ul>
                                {categories.map((cat) => (
                                    <li key={cat} onClick={() => {setFilterSelected(cat); setOpenFilter(false);}}>
                                        <div>
                                            {(filterSelected === cat) && <i className="fa-solid fa-check"></i> }
                                        </div>
                                        <p>{cat}</p>
                                    </li>
                                ))}
                        </ul>
                        }
                    </div>
                    <div className="controls__sort">
                        <div className="controls__sort__selected" onClick={()=> {setOpenSort(!openSort); setOpenFilter(false)}}>
                            <p>{sortSelected}</p>
                            <i className="fa-solid fa-filter"></i>
                        </div>
                        {
                            openSort && <ul>
                                {sorts.map((cat) => (
                                    <li key={cat} onClick={() => {setSortSelected(cat); setOpenSort(false);}}>
                                        <div>
                                            {(sortSelected === cat) && <i className="fa-solid fa-check"></i> }
                                        </div>
                                        <p>{cat}</p>
                                    </li>
                                ))}
                        </ul>
                        }
                    </div>
                </div>
                <div className="product__list">
                    {filteredAndSortedData.map((product) => (
                        <ProductCard
                        key={product._id}
                        id={product._id}
                        image={product.image}
                        title={product.title}
                        price={product.price}
                        description={product.description}
                        />
                    ))}
                    </div>


            </div>
        </>
    );
};

export default ClientProduct;
