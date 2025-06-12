import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';
import './Doctor.css';

type DoctorType = {
    _id?: string;
    fullName: string;
    discipline: string;
    experience?: string;
    rating: number | string;
    phoneNumber: string;
    email: string;
    permission: string;
    password?: string;
    doctor_id: string;
};

const Doctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsData, setDoctorsData] = useState<DoctorType[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addForm, setAddForm] = useState<DoctorType>({
        fullName: '',
        discipline: '',
        experience: '',
        rating: 1,
        phoneNumber: '',
        email: '',
        permission: '',
        password: '',
        doctor_id: '',
    });
    const [editForm, setEditForm] = useState<DoctorType | null>(null);
    const itemsPerPage = 5;

    // Fetch doctors from backend
    const fetchDoctors = () => {
        setLoading(true);
        axiosInstance.get('/doctor')
            .then(res => {
                const filtered = res.data.map((doc: any) => ({
                    _id: doc._id,
                    fullName: doc.fullName,
                    discipline: doc.discipline,
                    experience: doc.experience ? doc.experience : '',
                    rating: doc.rating,
                    phoneNumber: doc.phoneNumber,
                    email: doc.email,
                    permission: doc.permission,
                    doctor_id: doc.doctor_id,
                }));
                setDoctorsData(filtered);
                setLoading(false);
            })
            .catch(() => {
                setDoctorsData([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Filter doctors based on search term
    const filteredDoctors = doctorsData.filter(doctor =>
        (doctor._id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.discipline?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.experience?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.rating?.toString().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.permission?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.doctor_id?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

    // -------- Add Doctor --------
    const handleAddDoctor = () => {
        setShowAddForm(true);
    };

    const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (+addForm.rating < 1) {
            alert('Rating phải >= 1');
            return;
        }
        try {
            await axiosInstance.post('/doctor', {
                fullName: addForm.fullName,
                discipline: addForm.discipline,
                experience: addForm.experience,
                rating: Number(addForm.rating),
                phoneNumber: addForm.phoneNumber,
                email: addForm.email,
                permission: addForm.permission,
                password: addForm.password,
                doctor_id: addForm.doctor_id,
            });
            setShowAddForm(false);
            setAddForm({
                fullName: '',
                discipline: '',
                experience: '',
                rating: 1,
                phoneNumber: '',
                email: '',
                permission: '',
                password: '',
                doctor_id: '',
            });
            fetchDoctors();
            alert('Thêm bác sĩ thành công!');
        } catch (err: any) {
            if (err?.response?.data?.message?.includes('duplicate key')) {
                alert('Doctor ID đã tồn tại, vui lòng nhập mã khác!');
            } else {
                alert('Thêm bác sĩ thất bại!');
            }
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setAddForm({
            fullName: '',
            discipline: '',
            experience: '',
            rating: 1,
            phoneNumber: '',
            email: '',
            permission: '',
            password: '',
            doctor_id: '',
        });
    };

    // -------- Edit Doctor --------
    const handleEditDoctor = (doctorId: string) => {
        const doc = doctorsData.find(d => d._id === doctorId);
        if (doc) {
            setEditForm({ ...doc, password: '' }); // không show password thật
            setShowEditForm(true);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm || !editForm._id) return;
        if (+editForm.rating < 1) {
            alert('Rating phải >= 1');
            return;
        }
        try {
            // Chỉ gửi các trường cho phép sửa (không nên gửi password nếu không nhập mới)
            const dataToSend: any = {
                fullName: editForm.fullName,
                discipline: editForm.discipline,
                experience: editForm.experience,
                rating: Number(editForm.rating),
                phoneNumber: editForm.phoneNumber,
                email: editForm.email,
                permission: editForm.permission,
                doctor_id: editForm.doctor_id,
            };
            if (editForm.password) {
                dataToSend.password = editForm.password;
            }
            await axiosInstance.patch(`/doctor/${editForm._id}`, dataToSend);
            setShowEditForm(false);
            setEditForm(null);
            fetchDoctors();
            alert('Cập nhật bác sĩ thành công!');
        } catch (err: any) {
            alert('Cập nhật bác sĩ thất bại!');
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm(null);
    };

    // -------- Delete Doctor --------
    const handleDeleteDoctor = async (doctorId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            try {
                await axiosInstance.delete(`/doctor/${doctorId}`);
                setDoctorsData(prev => prev.filter(doc => doc._id !== doctorId));
                alert('Đã xóa bác sĩ thành công!');
            } catch (err: any) {
                alert('Xóa bác sĩ thất bại!');
            }
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="doctor_container">
            {/* Header */}
            <div className="doctor_header">
                <div className="doctor_title"> List of doctors </div>
                <div className="doctor_controls">
                    <div className="doctor_search_container">
                        <svg className="doctor_search_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Find a doctor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="doctor_search_input"
                        />
                    </div>
                    <button
                        onClick={handleAddDoctor}
                        className="doctor_add_button"
                    >
                        Add new doctor
                    </button>
                </div>
            </div>

            {/* Add Doctor Form */}
            {showAddForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
                        <h3>Thêm bác sĩ mới</h3>
                        <input name="fullName" placeholder="Full name" value={addForm.fullName} onChange={handleAddFormChange} required />
                        <input name="doctor_id" placeholder="Doctor ID" value={addForm.doctor_id} onChange={handleAddFormChange} required />
                        <input name="discipline" placeholder="Specialty" value={addForm.discipline} onChange={handleAddFormChange} required />
                        <input name="experience" placeholder="Experience (tùy chọn)" value={addForm.experience} onChange={handleAddFormChange} />
                        <input name="rating" type="number" min={1} max={5} step={0.1} placeholder="Rating" value={addForm.rating} onChange={handleAddFormChange} required />
                        <input name="phoneNumber" placeholder="Phone number" value={addForm.phoneNumber} onChange={handleAddFormChange} required />
                        <input name="email" type="email" placeholder="Email" value={addForm.email} onChange={handleAddFormChange} required />
                        <input name="permission" placeholder="Permission" value={addForm.permission} onChange={handleAddFormChange} required />
                        <input name="password" type="password" placeholder="Password" value={addForm.password} onChange={handleAddFormChange} required />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Lưu</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelAdd}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Doctor Form */}
            {showEditForm && editForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
                        <h3>Cập nhật bác sĩ</h3>
                        <input name="fullName" placeholder="Full name" value={editForm.fullName} onChange={handleEditFormChange} required />
                        <input name="doctor_id" placeholder="Doctor ID" value={editForm.doctor_id} onChange={handleEditFormChange} required />
                        <input name="discipline" placeholder="Specialty" value={editForm.discipline} onChange={handleEditFormChange} required />
                        <input name="experience" placeholder="Experience (tùy chọn)" value={editForm.experience} onChange={handleEditFormChange} />
                        <input name="rating" type="number" min={1} max={5} step={0.1} placeholder="Rating" value={editForm.rating} onChange={handleEditFormChange} required />
                        <input name="phoneNumber" placeholder="Phone number" value={editForm.phoneNumber} onChange={handleEditFormChange} required />
                        <input name="email" type="email" placeholder="Email" value={editForm.email} onChange={handleEditFormChange} required />
                        <input name="permission" placeholder="Permission" value={editForm.permission} onChange={handleEditFormChange} required />
                        <input name="password" type="password" placeholder="Password (bỏ trống nếu không đổi)" value={editForm.password || ''} onChange={handleEditFormChange} />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Lưu</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelEdit}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="doctor_table">
                {/* Table Header */}
                <div className="doctor_table_header">
                    <div className="doctor_table_header_grid">
                        <div>ID</div>
                        <div>Full name</div>
                        <div className="doctor_cell_specialty">Specialty</div>
                        <div className="doctor_cell_experience">Experience</div>
                        <div>Review</div>
                        <div className="doctor_cell_phone">Phone number</div>
                        <div>Operation</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="doctor_table_body">
                    {loading ? (
                        <div className="doctor_no_results">Đang tải...</div>
                    ) : currentDoctors.length > 0 ? (
                        currentDoctors.map((doctor) => (
                            <div key={doctor._id} className="doctor_table_row">
                                <div className="doctor_table_row_grid">
                                    <div className="doctor_cell_id">
                                        {doctor._id}
                                    </div>
                                    <div className="doctor_cell_name">
                                        {doctor.fullName}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_specialty">
                                        {doctor.discipline}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_experience">
                                        {doctor.experience}
                                    </div>
                                    <div className="doctor_rating">
                                        {doctor.rating}
                                        <span className="doctor_rating_star">⭐</span>
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_phone">
                                        {doctor.phoneNumber}
                                    </div>
                                    <div className="doctor_actions">
                                        <button
                                            onClick={() => handleEditDoctor(doctor._id!)}
                                            className="action_button edit_button"
                                            title="Edit Profile"
                                        >
                                            <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Fix
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doctor._id!)}
                                            className="action_button delete_button"
                                            title="Delete doctor"
                                        >
                                            <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="doctor_no_results">
                            No suitable doctor found
                        </div>
                    )}
                </div>
            </div>

            {/* Summary and Pagination */}
            <div className="doctor_summary">
                <div>
                    Show {currentDoctors.length} / {filteredDoctors.length} doctors
                </div>
                
                {totalPages > 1 && (
                    <div className="doctor_pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="pagination_button"
                        >
                            Before
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`pagination_button ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="pagination_button"
                        >
                            After
                        </button>
                        
                        <div className="pagination_info">
                            Page {currentPage} / {totalPages}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctor;