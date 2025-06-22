// import '../css/AboutUs.css'
import { useParams, useNavigate  } from "react-router-dom";
import { useState, useEffect } from "react";
import avatarDefault from '../../assets/pictures/avatar.jpg';
import "./style.scss";

const Profile = () => {
    const {id} = useParams()
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch(`http://localhost:8000/patient/${id}`)
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })
    }, [])

    const navigate = useNavigate();
    const goTo = (route: string) => {
        navigate(route);
    };

    return (
        <div className="profile-container">
            <h2>Thông tin cá nhân</h2>
            <div className="profile-box">
                <img
                src={user?.avatar || avatarDefault}
                alt="Avatar"
                className="profile-avatar"
                />
                <div className="profile-info">
                <p><strong>Họ tên:</strong> {user?.fullName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Ngày sinh:</strong> {new Date(user?.birthDay).toLocaleDateString()}</p>
                <p><strong>Mã bệnh nhân:</strong> {user?.patient_id}</p>
                </div>
            </div>

            <div className="profile-actions">
                <button onClick={() => goTo(`/diagnose-history/${id}`)}>Lịch sử chẩn đoán</button>
                <button onClick={() => goTo(`/appointment/${id}`)}>Cuộc hẹn với bác sĩ</button>
                <button onClick={() => goTo(`/orders/${id}`)}>Lịch sử mua hàng</button>
            </div>
            </div>
    );
}

export default Profile