import { Outlet } from "react-router-dom";
import "./Layout.css";

import Navbar from "../navbar/Navbar";
import Navbar_2 from "../navbar/Navbar_2";
import Footer from "../footer/footer";

const LayoutClient = () => {
    return (
        <div className='home'>
            <div className='home_navbar'>
                <Navbar/>
                <Navbar_2 />
            </div>
            <Outlet />
            <Footer />
        </div>
    );
};

export default LayoutClient;