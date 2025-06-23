import "./style.scss";
import { useParams } from "react-router-dom";

const ClientProductDetail = () => {
    const {id} = useParams();
    return (
        <>
            {id}
        </>
    );
}


export default ClientProductDetail;