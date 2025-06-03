import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Slidebar.css'
import TechwiqLogo from '../../../assets/pictures/Techwiq_orig.png'

type SectionType = 'dashboard' | 'usersRoles' | 'systemSettings';

const Slidebar = () => {
    const navigate = useNavigate();

    const [isOpenFather, setIsOpenFather] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Record<SectionType, boolean>>({
        dashboard: true,
        usersRoles: true,
        systemSettings: true
    });
    const [activeItem, setActiveItem] = useState<string>(''); // Thêm state để track active item

    const toggleSlidebar = () => {
        setIsOpenFather(!isOpenFather);
        // Close all expanded sections when sidebar is collapsed
        setExpandedSections({
            dashboard: !isOpenFather,
            usersRoles: !isOpenFather,
            systemSettings: !isOpenFather
        });
    };

    const toggleSection = (section: SectionType) => {
        if (!isOpenFather) return; // Don't allow expansion when sidebar is collapsed
        
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const navigateTo = (path: string) => {
        navigate(path);
    };

    const handleDashboardItemClick = (item: string) => {
        setActiveItem(item); // Set active item
        switch(item) {
            case 'dashboard':
                navigateTo('/dashboard');
                break;
            case 'diagnosis':
                navigateTo('/dashboard/diagnose_manager');
                break;
            case 'appointments':
                navigateTo('/dashboard/appointments');
                break;
            case 'doctors':
                navigateTo('/dashboard/doctors');
                break;
            case 'patients':
                navigateTo('/dashboard/patients');
                break;
            case 'products':
                navigateTo('/dashboard/products');
                break;
            case 'orders':
                navigateTo('/dashboard/orders');
                break;
            default:
                break;
        }
    };

    const handleUsersRolesItemClick = (item: string) => {
        setActiveItem(item); // Set active item
        switch(item) {
            case 'users':
                navigateTo('/users');
                break;
            case 'roles':
                navigateTo('/roles-permissions');
                break;
            default:
                break;
        }
    };

    const handleSystemSettingsItemClick = (item: string) => {
        setActiveItem(item); // Set active item
        switch(item) {
            case 'general':
                navigateTo('/general-settings');
                break;
            case 'ai':
                navigateTo('/ai-configuration');
                break;
            case 'payment':
                navigateTo('/payment-settings');
                break;
            default:
                break;
        }
    };

    return (
        <div className={`slidebar ${isOpenFather ? '' : 'closed'}`}>
            <div className={`slidebar_logo ${isOpenFather ? '' : 'closed'}`}>
                <img 
                    src={TechwiqLogo} 
                    alt="Techwiq Logo" 
                    width={88.4824447631836} 
                    height={24}
                    className={isOpenFather ? '' : 'hidden'}
                />
                <div onClick={toggleSlidebar} className={`hamburger-icon ${isOpenFather ? '' : 'closed'}`}>
                    <svg 
                        viewBox="-0.5 0 25 25" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" 
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M2.5 12.5H17.5" stroke="#FFFFFF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M2.5 6.5H21.5" stroke="#FFFFFF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M2.5 18.5H13.5" stroke="#FFFFFF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                    </svg>
                </div>
            </div>
            <div className="slidebar_content">
                <div 
                    className='slidebar_functions_logo clickable' 
                    onClick={() => toggleSection('dashboard')}
                >
                    <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xmlSpace="preserve" fill="#000000">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path fill="#FFFFFF" d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28
                            c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234
                            L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16
                            c2.211,0,4-1.789,4-4V33.695l1.195,1.195
                            c1.562,1.562,3.949,1.422,5.516-0.141
                            C64.274,33.188,64.356,30.734,62.79,29.172z" />
                        </g>
                    </svg>
                    {isOpenFather && (
                        <>
                            <span>Dashboard</span>
                            <div className={`expand_arrow ${expandedSections.dashboard ? 'expanded' : ''}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </>
                    )}
                </div>
                
                <div className={`slidebar_subsection ${expandedSections.dashboard ? 'expanded' : 'collapsed'}`}>
                    <div 
                        className={`slidebar_functions ${activeItem === 'dashboard' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('dashboard')}
                    >
                        Dashboard Overview
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'diagnosis' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('diagnosis')}
                    >
                        Diagnosis Management
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'appointments' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('appointments')}
                    >
                        Appointments
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'doctors' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('doctors')}
                    >
                        Doctors
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'patients' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('patients')}
                    >
                        Patients
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'products' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('products')}
                    >
                        Products
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'orders' ? 'now' : ''}`} 
                        onClick={() => handleDashboardItemClick('orders')}
                    >
                        Orders
                    </div>
                </div>

                <div 
                    className='slidebar_functions_logo clickable' 
                    onClick={() => toggleSection('usersRoles')}
                >
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path>
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path>
                        </g>
                    </svg>
                    {isOpenFather && (
                        <>
                            <span>Users & Roles</span>
                            <div className={`expand_arrow ${expandedSections.usersRoles ? 'expanded' : ''}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </>
                    )}
                </div>
                
                <div className={`slidebar_subsection ${expandedSections.usersRoles ? 'expanded' : 'collapsed'}`}>
                    <div 
                        className={`slidebar_functions ${activeItem === 'users' ? 'now' : ''}`} 
                        onClick={() => handleUsersRolesItemClick('users')}
                    >
                        User
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'roles' ? 'now' : ''}`} 
                        onClick={() => handleUsersRolesItemClick('roles')}
                    >
                        Roles & Permissions
                    </div>
                </div>

                <div 
                    className='slidebar_functions_logo clickable' 
                    onClick={() => toggleSection('systemSettings')}
                >
                    <svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <style>{`.st0 { fill: #ffffff; }`}</style>
                            <g>
                                <path className="st0" d="M499.139,318.571l-37.178-5.407c-2.329-0.178-4.336-1.642-5.228-3.8l-12.054-29.086 c-0.901-2.15-0.526-4.613,1-6.379l22.243-29.88c3.533-4.141,3.301-10.314-0.554-14.168l-17.602-17.594 c-3.846-3.854-10.029-4.104-14.159-0.553l-29.889,22.233c-1.758,1.518-4.238,1.91-6.38,1.018l-29.094-12.062 c-2.151-0.883-3.622-2.926-3.81-5.228l-5.389-37.169c-0.428-5.442-4.96-9.635-10.402-9.635h-24.893 c-5.45,0-9.983,4.193-10.402,9.635l-5.407,37.169c-0.17,2.32-1.642,4.345-3.792,5.228l-29.103,12.062 c-2.151,0.892-4.613,0.5-6.388-1.018l-29.872-22.233c-4.13-3.542-10.304-3.302-14.167,0.553l-17.594,17.594 c-3.854,3.854-4.086,10.028-0.554,14.168l22.234,29.888c1.508,1.758,1.91,4.229,1.009,6.371l-12.054,29.086 c-0.874,2.159-2.908,3.622-5.219,3.81l-37.195,5.398c-5.425,0.429-9.618,4.961-9.618,10.412v24.883 c0,5.442,4.194,9.993,9.618,10.403l37.195,5.398c2.311,0.188,4.345,1.659,5.219,3.81l12.054,29.086 c0.901,2.159,0.5,4.63-1.009,6.388l-22.234,29.889c-3.533,4.14-3.301,10.295,0.554,14.168l17.594,17.594 c3.863,3.854,10.037,4.086,14.167,0.544l29.872-22.243c1.775-1.498,4.237-1.9,6.388-0.998l29.103,12.044 c2.151,0.902,3.622,2.918,3.802,5.246l5.398,37.169c0.428,5.433,4.952,9.636,10.402,9.636h24.893c5.451,0,9.974-4.203,10.402-9.636 l5.389-37.169c0.188-2.328,1.659-4.344,3.81-5.246l29.103-12.044c2.142-0.902,4.622-0.5,6.379,0.998l29.881,22.243 c4.13,3.542,10.314,3.31,14.159-0.544l17.602-17.594c3.864-3.873,4.087-10.028,0.554-14.168l-22.243-29.889 c-1.499-1.758-1.9-4.229-1-6.388l12.054-29.086c0.892-2.151,2.899-3.622,5.228-3.81l37.178-5.398 c5.434-0.41,9.627-4.961,9.627-10.403v-24.883C508.766,323.532,504.573,319,499.139,318.571z M379.093,382.328 c-10.93,10.912-25.445,16.926-40.898,16.926c-15.444,0-29.978-6.014-40.898-16.926c-10.92-10.938-16.943-25.454-16.943-40.907 c0-15.444,6.022-29.969,16.943-40.89c10.92-10.939,25.454-16.934,40.898-16.934c15.454,0,29.969,5.995,40.898,16.934 c10.92,10.92,16.934,25.446,16.934,40.89C396.027,356.874,390.014,371.39,379.093,382.328z"></path>
                                <path className="st0" d="M187.351,252.156c4.032-1.445,6.254-5.746,5.122-9.868l-5.898-28.854c-0.472-1.767,0.072-3.649,1.419-4.88 l18.263-16.621c1.338-1.222,3.284-1.588,4.97-0.946l27.961,8.466c3.989,1.508,8.485-0.294,10.306-4.166l8.297-17.656 c1.837-3.881,0.366-8.485-3.346-10.591l-24.339-16.14c-1.58-0.91-2.535-2.632-2.436-4.452l1.16-24.66 c0.098-1.829,1.186-3.444,2.838-4.194l26.008-13.874c3.898-1.74,5.781-6.218,4.336-10.215l-6.603-18.371 c-1.454-4.024-5.755-6.254-9.876-5.121l-28.863,5.879c-1.767,0.5-3.632-0.053-4.871-1.41L195.185,56.23 c-1.24-1.357-1.614-3.265-0.955-4.978l8.468-27.944c1.507-4.006-0.294-8.494-4.175-10.306l-17.648-8.306 c-3.872-1.821-8.494-0.366-10.608,3.354l-16.131,24.34c-0.902,1.58-2.623,2.533-4.444,2.445l-24.66-1.169 c-1.82-0.08-3.462-1.205-4.202-2.847L106.974,4.821c-1.758-3.898-6.219-5.782-10.234-4.336L78.379,7.096 c-4.024,1.446-6.254,5.738-5.112,9.859l5.888,28.872c0.482,1.748-0.062,3.64-1.418,4.862l-18.264,16.63 c-1.356,1.222-3.274,1.597-4.987,0.955l-27.944-8.476c-3.988-1.516-8.476,0.304-10.305,4.175L7.939,81.622 c-1.82,3.872-0.366,8.494,3.346,10.599l24.339,16.14c1.588,0.902,2.534,2.615,2.436,4.435l-1.16,24.66 c-0.071,1.838-1.187,3.444-2.837,4.193L8.055,155.522c-3.9,1.749-5.782,6.219-4.336,10.216l6.611,18.37 c1.445,4.024,5.746,6.254,9.859,5.131l28.881-5.906c1.749-0.482,3.64,0.071,4.862,1.427l16.612,18.255 c1.24,1.356,1.598,3.283,0.954,4.987l-8.466,27.944c-1.499,3.997,0.304,8.485,4.175,10.305l17.648,8.297 c3.881,1.829,8.493,0.357,10.608-3.346l16.122-24.348c0.91-1.57,2.623-2.534,4.452-2.428l24.661,1.16 c1.829,0.09,3.453,1.178,4.211,2.846l13.847,25.989c1.767,3.9,6.219,5.8,10.233,4.354L187.351,252.156z M148.229,172.296 c-11.394,4.095-23.714,3.524-34.68-1.633c-10.965-5.157-19.245-14.275-23.358-25.678c-4.095-11.402-3.524-23.714,1.634-34.67 c5.156-10.974,14.283-19.254,25.677-23.357c11.402-4.105,23.714-3.534,34.67,1.641c10.956,5.139,19.254,14.258,23.366,25.66 c4.096,11.403,3.516,23.706-1.632,34.672C168.731,159.886,159.621,168.183,148.229,172.296z"></path>
                            </g>
                        </g>
                    </svg>
                    {isOpenFather && (
                        <>
                            <span>System Settings</span>
                            <div className={`expand_arrow ${expandedSections.systemSettings ? 'expanded' : ''}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </>
                    )}
                </div>
                
                <div className={`slidebar_subsection ${expandedSections.systemSettings ? 'expanded' : 'collapsed'}`}>
                    <div 
                        className={`slidebar_functions ${activeItem === 'general' ? 'now' : ''}`} 
                        onClick={() => handleSystemSettingsItemClick('general')}
                    >
                        General Settings
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'ai' ? 'now' : ''}`} 
                        onClick={() => handleSystemSettingsItemClick('ai')}
                    >
                        AI Configuration
                    </div>
                    <div 
                        className={`slidebar_functions ${activeItem === 'payment' ? 'now' : ''}`} 
                        onClick={() => handleSystemSettingsItemClick('payment')}
                    >
                        Payment Settings
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Slidebar