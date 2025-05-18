import Slidebar from "../../../components/tsx/Slidebar";
import MainDashBoardHeader from "../../../components/tsx/MainDashBoardHeader";
import Main_Dashboard from "./Main_Dashboard";

import "../css/Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Slidebar />
            <div className="dashboard_background">
                <MainDashBoardHeader />
                <Main_Dashboard />
            </div>     
        </div>
    );
};

export default Dashboard;