import { useRoutes } from "react-router-dom";
import LayoutAdmin from "../components/admin/layout/Layout";
import LayoutClient from "../components/client/layout/Layout";
import Home from "../pages/Home/tsx/Home";
import Dashboard from "../pages/managers/Dashboard/Dashboard";
import Diagnose_Manager from "../pages/managers/DiagnoseManager/Diagnose_Manager";
import Appointment from "../pages/managers/Appointment/Appointment";
import AboutUs from "../pages/AboutUs/tsx/AboutUs";
import DoctorAI from "../pages/DoctorAI/tsx/DoctorAi";
import Contact from "../pages/Home/tsx/contact";
import Doctor from "../pages/managers/Doctors/Doctor";
import Patient from "../pages/managers/Patients/Patient";
import Product from "../pages/managers/Products/Product";
import Order from "../pages/managers/Orders/Order";
import User from "../pages/managers/Users/User";
import RoleAndPermission from "../pages/managers/RoleAndPermission/RoleAndPermission";
import GeneralSetting from "../pages/managers/GeneralSettings/GeneralSetting";
import ConfigurationAI from "../pages/managers/AiConfiguration/ConfigurationAI";
import PaymentSettings from "../pages/managers/PaymentSettings/PaymentSettings";
import Register from "../pages/RegisterAndLogIn/RegisterLogIn";

const Routes = () => {
    const elements = useRoutes(
        [
            // Client Routes
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
                  },
                ]
            },
            // Public Routes
            {
                path:"/register-login",
                element: <Register/>,
            },
            // Admin Routes
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
                    },
                    {
                        path:"/dashboard/doctors",
                        element: <Doctor/>
                    },
                    {
                        path:"/dashboard/patients",
                        element: <Patient/>
                    },
                    {
                        path:"/dashboard/products",
                        element: <Product/>
                    },
                    {
                        path:"/dashboard/orders",
                        element: <Order/>
                    },
                    {
                        path:"/dashboard/users",
                        element: <User/>
                    },
                    {
                        path:"/dashboard/roles-permissions",
                        element: <RoleAndPermission/>
                    },
                    {
                        path:"/dashboard/general-settings",
                        element: <GeneralSetting/>
                    },
                    {
                        path:"/dashboard/ai-configuration",
                        element: <ConfigurationAI/>
                    },
                    {
                        path:"/dashboard/payment-settings",
                        element: <PaymentSettings/>
                    }
                ]
            }
        ]
    );
    return elements;
};

export default Routes