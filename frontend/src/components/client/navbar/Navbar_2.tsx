import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import avatarDefault from '../../../assets/pictures/avatar.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores/Store';
import {
  setNavbarActiveItem,
  setNavbarMenuOpen,
  resetUI,
} from '../../../stores/UiStore';

const Navbar_2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeItem = useSelector((state: RootState) => state.ui.navbarActiveItem);
  const menuOpen = useSelector((state: RootState) => state.ui.navbarMenuOpen);

  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        dispatch(setNavbarMenuOpen(false));
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    dispatch(setNavbarMenuOpen(false));
    dispatch(setNavbarActiveItem('home'));
    // Nếu muốn reset toàn bộ UI persist state (optional):
    // dispatch(resetUI());
    navigate('/');
  };

  const handleMenuClick = (item: string) => {
    dispatch(setNavbarMenuOpen(false));
    switch (item) {
      case 'profile':
        navigate(`/patient/${user.id || user.patient_id}`);
        break;
      default: break;
    }
  };

  return (
    <div className='navbar_2'>
      <div className='left_Navbar_2'>
        <span className={`left_Navbar_2_item ${activeItem === 'home' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('home')); navigate('/'); }}>Home</span>
        <span className={`left_Navbar_2_item ${activeItem === 'about-us' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('about-us')); navigate('/about-us'); }}>About us</span>
        <span className={`left_Navbar_2_item ${activeItem === 'doctors-ai' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('doctors-ai')); navigate('/doctors-ai'); }}>Doctors AI</span>
        <span className={`left_Navbar_2_item ${activeItem === 'contact' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('contact')); navigate('/contact'); }}>Contact</span>
      </div>
      <div className='right_Navbar_2'>
        {!user ? (
          <>
            <button className='sign_up' onClick={() => navigate('/register-login?mode=register')}>Sign up</button>
            <button className='log_in' onClick={() => navigate('/register-login?mode=login')}>Log in</button>
          </>
        ) : (
          <div className="Main_Dashboard_avatar_menu_wrap" ref={menuRef}>
            <img
              src={user.avatarUrl || user.avatar || avatarDefault}
              alt="avatar"
              className="dashboard_avatar"
              onClick={() => dispatch(setNavbarMenuOpen(!menuOpen))}
            />
            <span
              className="dashboard_greeting"
              onClick={() => dispatch(setNavbarMenuOpen(!menuOpen))}
            >
              Hi, {user?.fullName || user?.name || user?.username || user?.email || 'User'}
              <span className="dashboard_greeting_arrow">▼</span>
            </span>
            {menuOpen && (
              <div className="Main_Dashboard_dropdown_menu">
                <div className="dropdown_item" onClick={() => handleMenuClick('profile')}>Hồ sơ</div>
                <div className="dropdown_item">Lịch</div>
                <div className="dropdown_item">Báo cáo</div>
                <div className="dropdown_separator"></div>
                <div className="dropdown_item">Tuỳ chọn</div>
                <div className="dropdown_item">Ngôn ngữ</div>
                <div className="dropdown_separator"></div>
                <div className="dropdown_item logout" onClick={handleLogout}>Thoát</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar_2;