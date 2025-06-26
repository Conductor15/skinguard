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
import CartItem from '../../CartItem';

const Navbar_2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeItem = useSelector((state: RootState) => state.ui.navbarActiveItem);
  const menuOpen = useSelector((state: RootState) => state.ui.navbarMenuOpen);

  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    if(parsedUser.userType === "doctor"){
      fetch(`http://localhost:8000/doctor/${parsedUser.id || parsedUser.patient_id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error("Failed to fetch doctor info", err);
      });
    }
    else{
      fetch(`http://localhost:8000/patient/${parsedUser.id || parsedUser.patient_id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error("Failed to fetch patient info", err);
      });
    }
    // Gọi API để lấy thông tin đầy đủ
  }

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
  // Xoá toàn bộ dữ liệu liên quan đến phiên đăng nhập
  localStorage.removeItem('access_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('user');

  // Cập nhật lại state ứng dụng
  setUser(null);
  dispatch(setNavbarMenuOpen(false));
  dispatch(setNavbarActiveItem('home'));

  // (Tuỳ chọn) Reset UI store nếu có persist
  // dispatch(resetUI());

  // Chuyển hướng người dùng về trang chủ hoặc login
  navigate('/register-login');
};


  const handleMenuClick = (item: string) => {
    dispatch(setNavbarMenuOpen(false));

    navigate(`/${item}/${user._id}`);
  };

  let type;

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    type = parsedUser.userType;
  }

  let patient;
  if(type === "patient"){
    patient = true;
  }else{
    patient = false;
  }


  return (
    <div className='navbar_2'>
      <div className='left_Navbar_2'>
        <span className={`left_Navbar_2_item ${activeItem === 'home' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('home')); navigate('/'); }}>Home</span>
        { patient? (
          <><span className={`left_Navbar_2_item ${activeItem === 'doctors-ai' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('doctors-ai')); navigate('/doctors-ai'); }}>Doctors AI</span>
          <span className={`left_Navbar_2_item ${activeItem === 'products' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('products')); navigate('/products'); }}>Products</span>
          <span className={`left_Navbar_2_item ${activeItem === 'consult' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('consult')); navigate('/consult'); }}>Consult</span>
          </>)
          :
          (
            <span className={`left_Navbar_2_item ${activeItem === 'appointments' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('appointments')); navigate('/appointments'); }}>Appointment</span>
          )
        }
        <span className={`left_Navbar_2_item ${activeItem === 'about-us' ? 'now' : ''}`} onClick={() => { dispatch(setNavbarActiveItem('about-us')); navigate('/about-us'); }}>About us</span>
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
              src={user?.avatarUrl || user?.avatar || avatarDefault}
              alt="avatar"
              className="dashboard_avatar"
              onClick={() => dispatch(setNavbarMenuOpen(!menuOpen))}
            />
            <span
              className="dashboard_greeting"
              onClick={() => dispatch(setNavbarMenuOpen(!menuOpen))}
            >
              Hi, {user?.fullName || user?.name || user?.username || user?.email || 'User'}
              {/* <i className="fa-solid fa-caret-down"></i> */}
            </span>
            {patient && <CartItem/>
            }
            {menuOpen && (
              <div className="Main_Dashboard_dropdown_menu">
                <div className="dropdown_item" onClick={() => handleMenuClick('profile')}>Profile</div>
                <div className="dropdown_item" onClick={() => handleMenuClick('appointment')}>Appointment</div>
                <div className="dropdown_item" onClick={() => handleMenuClick('diagnose-history')}>Diagnose History</div>
                <div className="dropdown_item" onClick={() => handleMenuClick('diagnose-history')}>Orders</div>
                <div className="dropdown_separator"></div>
                <div className="dropdown_item">Settings</div>
                <div className="dropdown_separator"></div>
                <div className="dropdown_item logout" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar_2;