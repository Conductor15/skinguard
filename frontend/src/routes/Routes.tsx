import { useRoutes } from "react-router-dom";
import LayoutAdmin from "../components/admin/layout/Layout";
import LayoutClient from "../components/client/layout/Layout";
import Home from "../pages/Home/tsx/Home";
import Dashboard from "../pages/managers/Dashboard/Dashboard";
import Diagnose_Manager from "../pages/managers/diagnoseManager/Diagnose_Manager";
import Appointment from "../pages/managers/appointment/Appointment";
import AboutUs from "../pages/AboutUs/tsx/AboutUs";
import DoctorAI from "../pages/DoctorAI/tsx/DoctorAi";
import Contact from "../pages/Home/tsx/contact";

const Routes = () => {
    const elements = useRoutes(
        [
            {
                path:"/",
                element: <LayoutClient/>,
                children:[
                  {
                      path:"/",
                      element: <Home/>
                  },
                  {
                      path:"/about-us",
                      element: <AboutUs/>
                  },
                  {
                      path:"/doctors-ai",
                      element: <DoctorAI/>
                  },
                  {
                      path:"/contact",
                      element: <Contact/>
                  }
                ]
            },
            {
                path:"/",
                element: <LayoutAdmin/>,
                children:[
                    {
                        path:"/dashboard",
                        element: <Dashboard/>
                    },
                    {
                        path:"/dashboard/diagnose_manager",
                        element: <Diagnose_Manager/>
                    },
                    {
                        path:"/dashboard/appointments",
                        element: <Appointment/>
                    }
                ]
            }
        ]
    );
    return elements;
};

export default Routes