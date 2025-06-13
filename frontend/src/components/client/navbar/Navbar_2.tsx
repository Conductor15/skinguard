import './navbar.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import avatarDefault from '../../../assets/pictures/avatar.jpg'

const Navbar_2 = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState<string>('home');
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setMenuOpen(false);
        setActiveItem('home');
        navigate('/');
    };

    const handleMenuClick = (item: string) => {
        setMenuOpen(false);
        switch (item) {
            case 'profile':
                navigate(`/patient/${user.id || user.patient_id}`);
                break;
            // Các case khác bạn tự bổ sung theo route ứng dụng
            default:
                break;
        }
    };

    return (
        <div className='navbar_2'>
            <div className='left_Navbar_2'>
                <span className={`left_Navbar_2_item ${activeItem === 'home' ? 'now' : ''}`} onClick={() => { setActiveItem('home'); navigate('/'); }}>Home</span>
                <span className={`left_Navbar_2_item ${activeItem === 'about-us' ? 'now' : ''}`} onClick={() => { setActiveItem('about-us'); navigate('/about-us'); }}>About us</span>
                <span className={`left_Navbar_2_item ${activeItem === 'doctors-ai' ? 'now' : ''}`} onClick={() => { setActiveItem('doctors-ai'); navigate('/doctors-ai'); }}>Doctors AI</span>
                <span className={`left_Navbar_2_item ${activeItem === 'contact' ? 'now' : ''}`} onClick={() => { setActiveItem('contact'); navigate('/contact'); }}>Contact</span>
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
                            onClick={() => setMenuOpen((v) => !v)}
                        />
                        <span
                            className="dashboard_greeting"
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            Hi, {user?.fullName || user?.name || user?.username || user?.email || 'User'}
                            <span className="dashboard_greeting_arrow">▼</span>
                        </span>
                        {menuOpen && (
                            <div className="Main_Dashboard_dropdown_menu">
                                <div className="dropdown_item" onClick={() => handleMenuClick('profile')}>Hồ sơ</div>
                                <div className="dropdown_item">Điểm</div>
                                <div className="dropdown_item">Lịch</div>
                                <div className="dropdown_item">Tập tin riêng tư</div>
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
    )
}

export default Navbar_2;