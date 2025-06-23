// import '../css/AboutUs.css'
import { useParams, useNavigate  } from "react-router-dom";
import { useState, useEffect } from "react";
import avatarDefault from '../../assets/pictures/avatar.jpg';
import "./style.scss";
import { PatientType } from "../../types/Types";
type SortField = keyof PatientType | '';
import axiosInstance from "../../api/Axios";

const defaultPatient: PatientType & { birthDay: string } = {
  patient_id: '',
  fullName: '',
  email: '',
  password: '',
  birthDay: '',
  phone: '',
  avatar: '',
  status: ''
};

const Profile = () => {
    const {id} = useParams()
    const [user, setUser] = useState<any>(null);
    const [editForm, setEditForm] = useState<(PatientType & { birthDay: string; _id?: string })>({ ...defaultPatient, _id: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editImageUploading, setEditImageUploading] = useState(false);

    const handleEditPatient = (patient: PatientType & { birthDay: string; _id?: string }) => {
        setEditForm({
          _id: patient._id,
          patient_id: patient.patient_id,
          fullName: patient.fullName,
          email: patient.email,
          password: '',
          phone: patient.phone,
          avatar: patient.avatar,
          status: patient.status,
          birthDay: patient.birthDay || ''
        });
        setShowEditForm(true);
      };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditLoading(true);
        try {
        if (editForm._id) {
            const { _id, ...dataToSend } = editForm;
            if (!dataToSend.password) delete dataToSend.password;
            await axiosInstance.patch(`/patient/${editForm._id}`, dataToSend);
        }
        setShowEditForm(false);
        // await fetchPatients();
        window.location.reload();

        } catch (e: any) {
        if (e?.response?.data?.message) {
            alert(e.response.data.message);
        } else {
            alert("Update failed!");
        }
        }
        setEditLoading(false);
    };

    const fetchUser = async () => {
        try {
        const res = await axiosInstance.get(`/patient/${id}`);
        setUser(res.data);
        } catch {
        alert("Failed to load user");
        }
    };
    useEffect(() => {
        fetchUser();
    }, [id]);


    // Fetch patients
    const fetchPatients = async () => {
        setLoading(true);
        try {
        const res = await axiosInstance.get('/patient');
        setUser(res.data);
        } catch {
        setUser([]);
        }
        setLoading(false);
    };

    const navigate = useNavigate();
    const goTo = (route: string) => {
        navigate(route);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };


    // Upload image for edit form
    const handleEditImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        const file = e.target.files?.[0];
        if (!file) return;
        setEditImageUploading(true);
        try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axiosInstance.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setEditForm(prev => prev ? ({ ...prev, avatar: res.data.url }) : prev);
        } catch (err) {
        alert('Upload image failed!');
        }
        setEditImageUploading(false);
    };

    const handleCancelEdit = () => setShowEditForm(false);
    
    return (
        <>
            <div className="profile-container">
                <h2>Thông tin cá nhân</h2>
                <div className="profile-box">
                    <img
                    src={user?.avatar || avatarDefault}
                    alt="Avatar"
                    className="profile-avatar"
                    />
                    <div className="profile-info">
                    <p><strong>Mã bệnh nhân:</strong> {user?.patient_id}</p>
                    <p><strong>Họ tên:</strong> {user?.fullName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Phone:</strong> {user?.phone || ""}</p>
                    <p><strong>Ngày sinh:</strong> {new Date(user?.birthDay).toLocaleDateString()}</p>
                    <p><strong>Ngày đăng ký:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    <button onClick={() => handleEditPatient(user)}>Cập nhật thông tin</button>
                    <button onClick={() => goTo(`/diagnose-history/${id}`)}>Lịch sử chẩn đoán</button>
                    <button onClick={() => goTo(`/appointment/${id}`)}>Cuộc hẹn với bác sĩ</button>
                    <button onClick={() => goTo(`/orders/${id}`)}>Lịch sử mua hàng</button>
                </div>
                
            </div>
            
            {/* Edit Patient Form */}
            {showEditForm && (
                <div className="doctor_add_form_overlay">
                <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
                    <h3>Patient updates</h3>
                    <input name="patient_id" placeholder="Patient ID" value={editForm.patient_id} readOnly required />
                    <input name="fullName" placeholder="Full Name" value={editForm.fullName} onChange={handleEditFormChange} required />
                    <input name="email" type="email" placeholder="Email" value={editForm.email} onChange={handleEditFormChange} required />
                    <input name="password" type="password" placeholder="Password (bỏ trống nếu không đổi)" value={editForm.password || ""} onChange={handleEditFormChange} />
                    <input name="phone" placeholder="Phone number" value={editForm.phone} onChange={handleEditFormChange} required />
                    <input name="birthDay" type="date" placeholder="Birth Day" value={new Date(editForm.birthDay).toISOString().split("T")[0]}
 onChange={handleEditFormChange} required />
                    <div style={{ marginBottom: 8 }}>
                    <input
                        type="file"
                        accept='image/*'
                        onChange={handleEditImageFileChange}
                        disabled={editImageUploading}
                    />
                    {editImageUploading && <span>Uploading...</span>}
                    </div>
                    {editForm.avatar && <img src={editForm.avatar} alt="avatar" style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #eee', borderRadius: 4 }}/>}
                    <input name="status" placeholder="Status" value={editForm.status} onChange={handleEditFormChange} />
                    <div className="doctor_add_form_buttons">
                    <button type="submit" className="doctor_add_button" disabled={editLoading}>
                        {editLoading ? "Saving..." : "Save"}
                    </button>
                    <button type="button" className="doctor_cancel_button" onClick={handleCancelEdit} disabled={editLoading}>
                        Cancel
                    </button>
                    </div>
                </form>
                </div>
            )}

        </>
    );
}

export default Profile