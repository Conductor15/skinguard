import { useRoutes } from "react-router-dom";
import LayoutAdmin from "../components/admin/layout/Layout";
import LayoutClient from "../components/client/layout/Layout";
import Home from "../pages/Home/tsx/Home";
import Dashboard from "../pages/managers/Dashboard/Dashboard";
import Diagnose_Manager from "../pages/managers/DiagnoseManager/Diagnose_Manager";
import Appointment from "../pages/managers/Appointment/Appointment";
import AboutUs from "../pages/AboutUs/tsx/AboutUs";
import Profile from "../pages/Profile";
import ClientProduct from "../pages/ClientProduct";
import DoctorAI from "../pages/DoctorAI/tsx/DoctorAi";
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
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/client/auth/PrivateRoute";

const Routes = () => {
    const elements = useRoutes(
        [
            {
                path:"*",
                element: <NotFound/>
            },
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
                      element: 
                        <PrivateRoute>
                            <DoctorAI />
                        </PrivateRoute>
                  },
                  {
                      path:"/products",
                      element: 
                        <PrivateRoute>
                            <ClientProduct/>
                        </PrivateRoute>
                  },
                  {
                      path:"/profile/:id",
                      element: <Profile/>
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
                path:"/admin",
                element: <LayoutAdmin/>,
                children:[
                    {
                        path:"dashboard",
                        element: <Dashboard/>
                    },
                    {
                        path:"diagnose_manager",
                        element: <Diagnose_Manager/>
                    },
                    {
                        path:"appointments",
                        element: <Appointment/>
                    },
                    {
                        path:"doctors",
                        element: <Doctor/>
                    },
                    {
                        path:"patients",
                        element: <Patient/>
                    },
                    {
                        path:"products",
                        element: <Product/>
                    },
                    {
                        path:"orders",
                        element: <Order/>
                    },
                    {
                        path:"users",
                        element: <User/>
                    },
                    {
                        path:"roles-permissions",
                        element: <RoleAndPermission/>
                    },
                    {
                        path:"general-settings",
                        element: <GeneralSetting/>
                    },
                    {
                        path:"ai-configuration",
                        element: <ConfigurationAI/>
                    },
                    {
                        path:"payment-settings",
                        element: <PaymentSettings/>
                    }
                ]
            },
        ]
    );
    return elements;
};

export default Routes