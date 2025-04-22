import Slidebar from "../../../components/tsx/Slidebar";
import Main_Dashboard from "./Main_Dashboard";

import "../css/Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Slidebar />
            <Main_Dashboard />
        </div>
    );
};

export default Dashboard;