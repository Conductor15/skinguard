import { useRoutes } from "react-router-dom";
import LayoutAdmin from "../components/admin/layout/Layout";
import LayoutClient from "../components/client/layout/Layout";
import Home from "../pages/Home/tsx/Home";
import Dashboard from "../pages/managers/Dashboard/Dashboard";
import Diagnose_Manager from "../pages/managers/diagnoseManager/Diagnose_Manager";
import Appointment from "../pages/managers/appointment/Appointment";
import AboutUs from "../pages/AboutUs/tsx/AboutUs";
import Profile from "../pages/Profile";
import PatientAppointment from "../pages/PatientAppointment";
import PatientDiagnose from "../pages/PatientDiagnose";
import ClientProduct from "../pages/ClientProduct";
import ClientProductDetail from "../pages/ClientProductDetail";
import ClientConsult from "../pages/ClientConsult";
import DoctorAI from "../pages/DoctorAI/tsx/DoctorAi";
import Doctor from "../pages/managers/doctors/Doctor";
import Patient from "../pages/managers/patients/Patient";
import Product from "../pages/managers/products/Product";
import Order from "../pages/managers/orders/Order";
import OrderWithDetails from "../pages/managers/orders/OrderWithDetails";
import User from "../pages/managers/users/User";
import RoleAndPermission from "../pages/managers/roleAndPermission/RoleAndPermission";
import GeneralSetting from "../pages/managers/generalSettings/GeneralSetting";
import ConfigurationAI from "../pages/managers/aiConfiguration/ConfigurationAI";
import PaymentSettings from "../pages/managers/paymentSettings/PaymentSettings";
import Register from "../pages/RegisterAndLogIn/RegisterLogIn";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/client/auth/PrivateRoute";
import Cart from "../pages/Cart";

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
                      path:"/cart",
                      element: <Cart/>
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
                      path:"/products/:id",
                      element: 
                        <PrivateRoute>
                            <ClientProductDetail/>
                        </PrivateRoute>
                  },
                  {
                      path:"/consult",
                      element: 
                        <PrivateRoute>
                            <ClientConsult/>
                        </PrivateRoute>
                  },
                  {
                      path:"/profile/:id",
                      element:
                      <PrivateRoute>
                        <Profile/>
                      </PrivateRoute>
                  },
                  {
                      path:"/appointment/:id",
                      element:
                      <PrivateRoute>
                        <PatientAppointment/>
                      </PrivateRoute>
                  },
                  {
                      path:"/diagnose-history/:id",
                      element:
                      <PrivateRoute>
                        <PatientDiagnose/>
                      </PrivateRoute>
                  },
                //   {
                //       path:"/setting/:id",
                //       element:
                //       <PrivateRoute>
                //         <Profile/>
                //       </PrivateRoute>
                //   },
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