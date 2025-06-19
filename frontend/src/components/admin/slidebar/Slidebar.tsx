import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../stores/Store';
import {
  toggleSlidebar,
  toggleSection,
  setSlidebarActiveItem,
  SectionType} from '../../../stores/UiStore';
import TechwiqLogo from '../../../assets/pictures/Techwiq_orig.png';
import './Slidebar.css';

const Slidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const isOpenFather = useSelector((state: RootState) => state.ui.slidebarOpen);
  const expandedSections = useSelector((state: RootState) => state.ui.slidebarSections);
  const activeItem = useSelector((state: RootState) => state.ui.slidebarActiveItem);

  // Handler functions
  const handleToggleSlidebar = () => dispatch(toggleSlidebar());
  const handleToggleSection = (section: SectionType) => dispatch(toggleSection(section));
  const handleSetActive = (item: string) => dispatch(setSlidebarActiveItem(item));

  // Navigation handlers
  const handleDashboardItemClick = (item: string) => {
    handleSetActive(item);
    switch(item) {
      case 'dashboard': navigate('/dashboard'); break;
      case 'diagnosis': navigate('/dashboard/diagnose_manager'); break;
      case 'appointments': navigate('/dashboard/appointments'); break;
      case 'doctors': navigate('/dashboard/doctors'); break;
      case 'patients': navigate('/dashboard/patients'); break;
      case 'products': navigate('/dashboard/products'); break;
      case 'orders': navigate('/dashboard/orders'); break;
      default: break;
    }
  };

  const handleUsersRolesItemClick = (item: string) => {
    handleSetActive(item);
    switch(item) {
      case 'users': navigate('/dashboard/users'); break;
      case 'roles': navigate('/dashboard/roles-permissions'); break;
      default: break;
    }
  };

  const handleSystemSettingsItemClick = (item: string) => {
    handleSetActive(item);
    switch(item) {
      case 'general': navigate('/dashboard/general-settings'); break;
      case 'ai': navigate('/dashboard/ai-configuration'); break;
      case 'payment': navigate('/dashboard/payment-settings'); break;
      default: break;
    }
  };

  return (
    <div className={`slidebar ${isOpenFather ? '' : 'closed'}`}>
      <div className={`slidebar_logo ${isOpenFather ? '' : 'closed'}`}>
        <img
          src={TechwiqLogo}
          alt="Techwiq Logo"
          width={88}
          height={24}
          className={isOpenFather ? '' : 'hidden'}
        />
        <div
          onClick={handleToggleSlidebar}
          className={`hamburger-icon ${isOpenFather ? '' : 'closed'}`}
        >
          {/* SVG icon */}
          <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 12.5H17.5" stroke="#FFFFFF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2.5 6.5H21.5" stroke="#FFFFFF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2.5 18.5H13.5" stroke="#FFFFFF" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>
      <div className="slidebar_content">
        {/* Dashboard section */}
        <div
          className="slidebar_functions_logo clickable"
          onClick={() => handleToggleSection('dashboard')}
        >
          {/* SVG icon */}
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="#FFFFFF">
            <path d="M62.79,29.172l-28-28C34.009,0.391,32.985,0,31.962,0s-2.047,0.391-2.828,1.172l-28,28
              c-1.562,1.566-1.484,4.016,0.078,5.578c1.566,1.57,3.855,1.801,5.422,0.234L8,33.617V60c0,2.211,1.789,4,4,4h16V48h8v16h16
              c2.211,0,4-1.789,4-4V33.695l1.195,1.195c1.562,1.562,3.949,1.422,5.516-0.141C64.274,33.188,64.356,30.734,62.79,29.172z" />
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
          <div className={`slidebar_functions ${activeItem === 'dashboard' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('dashboard')}>Dashboard Overview</div>
          <div className={`slidebar_functions ${activeItem === 'diagnosis' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('diagnosis')}>Diagnosis Management</div>
          <div className={`slidebar_functions ${activeItem === 'appointments' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('appointments')}>Appointments</div>
          <div className={`slidebar_functions ${activeItem === 'doctors' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('doctors')}>Doctors</div>
          <div className={`slidebar_functions ${activeItem === 'patients' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('patients')}>Patients</div>
          <div className={`slidebar_functions ${activeItem === 'products' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('products')}>Products</div>
          <div className={`slidebar_functions ${activeItem === 'orders' ? 'now' : ''}`} onClick={() => handleDashboardItemClick('orders')}>Orders</div>
        </div>

        {/* Users & Roles section */}
        <div
          className="slidebar_functions_logo clickable"
          onClick={() => handleToggleSection('usersRoles')}
        >
          {/* SVG icon */}
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#ffffff"></path>
            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#ffffff"></path>
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
          <div className={`slidebar_functions ${activeItem === 'users' ? 'now' : ''}`} onClick={() => handleUsersRolesItemClick('users')}>User</div>
          <div className={`slidebar_functions ${activeItem === 'roles' ? 'now' : ''}`} onClick={() => handleUsersRolesItemClick('roles')}>Roles & Permissions</div>
        </div>

        {/* System Settings section */}
        <div
          className="slidebar_functions_logo clickable"
          onClick={() => handleToggleSection('systemSettings')}
        >
          {/* SVG icon */}
          <svg height="20" width="20" viewBox="0 0 512 512" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path d="M499.139,318.571l-37.178-5.407c-2.329-0.178-4.336-1.642-5.228-3.8l-12.054-29.086c-0.901-2.15-0.526-4.613,1-6.379
                l22.243-29.88c3.533-4.141,3.301-10.314-0.554-14.168l-17.602-17.594c-3.846-3.854-10.029-4.104-14.159-0.553l-29.889,22.233
                c-1.758,1.518-4.238,1.91-6.38,1.018l-29.094-12.062c-2.151-0.883-3.622-2.926-3.81-5.228l-5.389-37.169
                c-0.428-5.442-4.96-9.635-10.402-9.635h-24.893c-5.45,0-9.983,4.193-10.402,9.635l-5.407,37.169
                c-0.17,2.32-1.642,4.345-3.792,5.228l-29.103,12.062c-2.151,0.892-4.613,0.5-6.388-1.018l-29.872-22.233
                c-4.13-3.542-10.304-3.302-14.167,0.553l-17.594,17.594c-3.854,3.854-4.086,10.028-0.554,14.168l22.234,29.888
                c1.508,1.758,1.91,4.229,1.009,6.371l-12.054,29.086c-0.874,2.159-2.908,3.622-5.219,3.81l-37.195,5.398
                c-5.425,0.429-9.618,4.961-9.618,10.412v24.883c0,5.442,4.194,9.993,9.618,10.403l37.195,5.398
                c2.311,0.188,4.345,1.659,5.219,3.81l12.054,29.086c0.901,2.159,0.5,4.63-1.009,6.388l-22.234,29.889
                c-3.533,4.14-3.301,10.295,0.554,14.168l17.594,17.594c3.863,3.854,10.037,4.086,14.167,0.544l29.872-22.243
                c1.775-1.498,4.237-1.9,6.388-0.998l29.103,12.044c2.151,0.902,3.622,2.918,3.802,5.246l5.398,37.169
                c0.428,5.433,4.952,9.636,10.402,9.636h24.893c5.451,0,9.974-4.203,10.402-9.636l5.389-37.169
                c0.188-2.328,1.659-4.344,3.81-5.246l29.103-12.044c2.142-0.902,4.622-0.5,6.379,0.998l29.881,22.243
                c4.13,3.542,10.314,3.31,14.159-0.544l17.602-17.594c3.864-3.873,4.087-10.028,0.554-14.168l-22.243-29.889
                c-1.499-1.758-1.9-4.229-1-6.388l12.054-29.086c0.892-2.151,2.899-3.622,5.228-3.81l37.178-5.398
                c5.434-0.41,9.627-4.961,9.627-10.403v-24.883C508.766,323.532,504.573,319,499.139,318.571z M379.093,382.328
                c-10.93,10.912-25.445,16.926-40.898,16.926c-15.444,0-29.978-6.014-40.898-16.926c-10.92-10.938-16.943-25.454-16.943-40.907
                c0-15.444,6.022-29.969,16.943-40.89c10.92-10.939,25.454-16.934,40.898-16.934c15.454,0,29.969,5.995,40.898,16.934
                c10.92,10.92,16.934,25.446,16.934,40.89C396.027,356.874,390.014,371.39,379.093,382.328z"></path>
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
          <div className={`slidebar_functions ${activeItem === 'general' ? 'now' : ''}`} onClick={() => handleSystemSettingsItemClick('general')}>General Settings</div>
          <div className={`slidebar_functions ${activeItem === 'ai' ? 'now' : ''}`} onClick={() => handleSystemSettingsItemClick('ai')}>AI Configuration</div>
          <div className={`slidebar_functions ${activeItem === 'payment' ? 'now' : ''}`} onClick={() => handleSystemSettingsItemClick('payment')}>Payment Settings</div>
        </div>
      </div>
    </div>
  );
};

export default Slidebar;