import "./style.scss";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const ClientProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState();

    useEffect(() => {

    },[])
    
    return (
        <>
            {id}
        </>
    );
}


export default ClientProductDetail;