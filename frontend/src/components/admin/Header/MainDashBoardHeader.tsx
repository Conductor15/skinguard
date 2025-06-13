import "./MainDashBoardHeader.css";
import AvatarDefault from '../../../assets/pictures/avatar.jpg';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MainDashBoardHeader = () => {
    const [doctor, setDoctor] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            if (userObj && (userObj.role === "doctor" || userObj.isDoctor)) {
                setDoctor(userObj);
            }
        }
    }, []);

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
        setMenuOpen(false);
        navigate('/');
    };

    return (
        <div className='Main_Dashboard_header'>
            <div className='Main_Dashboard_look_up'>
                <span className="search_icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="7" stroke="#222" strokeWidth="2"/>
                        <line x1="16.2929" y1="16.7071" x2="14.4" y2="14.8142" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </span>
                <input type="text" placeholder="Search" />
            </div>
            <div className='Main_Dashboard_info'>
                {/* Mail Icon */}
                <span className="dashboard_header_icon">
                    <svg viewBox="0 0 24 24" fill="none">
                        <rect x="0" fill="none" width="24" height="24"></rect>
                        <path d="M20 4H4c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 4.236l-8 4.882-8-4.882V6h16v2.236z" fill="#000"/>
                    </svg>
                </span>
                {/* Bell Icon */}
                <span className="dashboard_header_icon">
                    <svg viewBox="0 0 16 16" fill="none">
                        <path d="M3 5C3 2.23858 5.23858 0 8 0C10.7614 0 13 2.23858 13 5V8L15 10V12H1V10L3 8V5Z" fill="#000"/>
                        <path d="M7.99999 16C6.69378 16 5.58254 15.1652 5.1707 14H10.8293C10.4175 15.1652 9.30621 16 7.99999 16Z" fill="#000"/>
                    </svg>
                </span>
                <div className="Main_Dashboard_avatar_menu_wrap" ref={menuRef}>
                    <img
                        src={doctor && doctor.avatarUrl ? doctor.avatarUrl : AvatarDefault}
                        alt="avatar"
                        className="dashboard_avatar"
                        onClick={() => setMenuOpen((v) => !v)}
                    />
                    <span
                        className="dashboard_greeting_2"
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        Hi, {doctor ? (doctor.fullName || doctor.name || doctor.email) : 'Bro'}
                        <span style={{ marginLeft: 3, fontSize: 18, userSelect: 'none' }}>▼</span>
                    </span>
                    {menuOpen && (
                        <div className="Main_Dashboard_dropdown_menu">
                            <div className="dropdown_item" onClick={()=>{setMenuOpen(false);}}>Hồ sơ</div>
                            <div className="dropdown_item">Lịch</div>
                            <div className="dropdown_item">Tập tin riêng tư</div>
                            <div className="dropdown_item">Báo cáo</div>
                            <div className="dropdown_separator"></div>
                            <div className="dropdown_item">Tuỳ chọn</div>
                            <div className="dropdown_item">Ngôn ngữ</div>
                            <div className="dropdown_separator"></div>
                            <div className="dropdown_item" style={{ color:'red' }} onClick={handleLogout}>Thoát</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainDashBoardHeader;