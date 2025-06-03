import { Outlet } from "react-router-dom";
import Slidebar from "../slidebar/Slidebar";
import MainDashBoardHeader from "../Header/MainDashBoardHeader";
import "./Layout.css";

const LayoutAdmin = () => {
    return (
        <div className="dashboard">
            <Slidebar />
            <div className="dashboard_background">
                <MainDashBoardHeader />
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutAdmin;