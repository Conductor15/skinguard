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

import { HambugerIcon, HomeIcon, ArrowIcon, PeopleIcon, SettingIcon } from '../../../assets/SVG/Svg';

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
          <HambugerIcon />
        </div>
      </div>
      <div className="slidebar_content">
        {/* Dashboard section */}
        <div
          className="slidebar_functions_logo clickable"
          onClick={() => handleToggleSection('dashboard')}
        >
          <HomeIcon />
          {isOpenFather && (
            <>
              <span>Dashboard</span>
              <div className={`expand_arrow ${expandedSections.dashboard ? 'expanded' : ''}`}>
                <ArrowIcon />
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
          <PeopleIcon />
          {isOpenFather && (
            <>
              <span>Users & Roles</span>
              <div className={`expand_arrow ${expandedSections.usersRoles ? 'expanded' : ''}`}>
                <ArrowIcon />
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
          <SettingIcon />
          {isOpenFather && (
            <>
              <span>System Settings</span>
              <div className={`expand_arrow ${expandedSections.systemSettings ? 'expanded' : ''}`}>
                <ArrowIcon />
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