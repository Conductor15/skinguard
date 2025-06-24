import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';
import './Doctor.css';
import { DoctorType } from '../../../types/Types';
import { SearchIcon, DeleteIcon, FixIcon } from '../../../assets/SVG/Svg';

type SortField = keyof DoctorType | '';
type SortOrder = 'increase' | 'decrease';

const sortableFields: { label: string, value: SortField }[] = [
    { label: "ID", value: "doctor_id" },
    { label: "Full Name", value: "fullName" },
    { label: "Email", value: "email" },
    { label: "PhoneNumber", value: "phoneNumber" },
    { label: "Rating", value: "rating" },
    { label: "Status", value: "status" },
    { label: "Experience Years", value: "experienceYears" }
];

// Generate a unique ID for a new doctor 
function getNextDoctorId(doctors: DoctorType[]): string {
    const prefix = "DCT";
    const usedNumbers = doctors
        .map(doc => doc.doctor_id)
        .filter(id => id && id.startsWith(prefix))
        .map(id => parseInt(id.replace(prefix, ""), 10))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    let nextNum = 1;
    for (let num of usedNumbers) {
        if (num === nextNum) nextNum++;
        else break;
    }
    return prefix + nextNum.toString().padStart(3, "0");
}

const Doctor = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [doctorsData, setDoctorsData] = useState<DoctorType[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addForm, setAddForm] = useState<DoctorType>({
        doctor_id: '',
        fullName: '',
        email: '',
        password: '',
        discipline: '',
        phoneNumber: '',
        avatar: '',
        rating: 1,
        status: '',
        experienceYears: 0
    });
    const [editForm, setEditForm] = useState<DoctorType | null>(null);
    const itemsPerPage = 5;

    // Image upload state
    const [addImageUploading, setAddImageUploading] = useState(false);
    const [editImageUploading, setEditImageUploading] = useState(false);

    // Sort state
    const [sortField, setSortField] = useState<SortField>('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('increase');

    // Fetch doctors from backend
    const fetchDoctors = () => {
        setLoading(true);
        axiosInstance.get('/doctor')
            .then(res => {
                const filtered = res.data.map((doc: any) => ({
                    _id: doc._id,
                    doctor_id: doc.doctor_id,
                    fullName: doc.fullName,
                    email: doc.email,
                    password: '', // Không trả về password
                    discipline: doc.discipline,
                    phoneNumber: doc.phoneNumber,
                    avatar: doc.avatar,
                    rating: doc.rating,
                    status: doc.status,
                    experienceYears: doc.experienceYears
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
        (doctor.doctor_id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.status?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.experienceYears?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (doctor.rating?.toString()?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    // Sort Logic
    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortOrder === 'increase'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder === 'increase'
                ? aVal - bVal
                : bVal - aVal;
        }
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
            return sortOrder === 'increase'
                ? (aVal === bVal ? 0 : aVal ? 1 : -1)
                : (aVal === bVal ? 0 : aVal ? -1 : 1);
        }
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedDoctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDoctors = sortedDoctors.slice(startIndex, endIndex);

    // -------- Add Doctor --------
    const handleAddDoctor = () => {
        const newId = getNextDoctorId(doctorsData);
        setAddForm({
            doctor_id: newId,
            fullName: '',
            email: '',
            password: '',
            discipline: '',
            phoneNumber: '',
            avatar: '',
            rating: 1,
            status: '',
            experienceYears: 0
        });
        setShowAddForm(true);
    };

    const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddForm(prev => ({
            ...prev,
            [e.target.name]: e.target.type === "number"
                ? Number(e.target.value)
                : e.target.value
        }));
    };

    // Upload image for add form
    const handleAddImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAddImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axiosInstance.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAddForm(prev => ({ ...prev, avatar: res.data.url }));
        } catch (err) {
            alert('Upload image failed!');
        }
        setAddImageUploading(false);
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !addForm.doctor_id ||
            !addForm.password ||
            !addForm.fullName ||
            !addForm.discipline ||
            !addForm.phoneNumber ||
            !addForm.email
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            await axiosInstance.post('/doctor', addForm);
            setShowAddForm(false);
            setAddForm({
                doctor_id: '',
                fullName: '',
                email: '',
                password: '',
                discipline: '',
                phoneNumber: '',
                avatar: '',
                rating: 1,
                status: '',
                experienceYears: 0
            });
            fetchDoctors();
            alert('Add doctor successfully!');
        } catch (err: any) {
            if (err?.response?.data?.message?.includes('duplicate key')) {
                alert('Doctor ID or email already exists, please check again!');
            } else {
                alert('Add doctor failed!');
            }
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setAddForm({
            doctor_id: '',
            fullName: '',
            email: '',
            password: '',
            discipline: '',
            phoneNumber: '',
            avatar: '',
            rating: 1,
            status: '',
            experienceYears: 0
        });
    };

    // -------- Edit Doctor --------
    const handleEditDoctor = (doctorId: string) => {
        const doc = doctorsData.find(d => d._id === doctorId);
        if (doc) {
            setEditForm({ ...doc, password: '' }); // Không show password
            setShowEditForm(true);
        }
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editForm) return;
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.type === "number"
                ? Number(e.target.value)
                : e.target.value
        });
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
            setEditForm(prev => prev ? ({ ...prev, avatar: res.data.url }) : null);
        } catch (err) {
            alert('Upload image failed!');
        }
        setEditImageUploading(false);
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm || !editForm._id) return;

        if (
            !editForm.doctor_id ||
            !editForm.fullName ||
            !editForm.discipline ||
            !editForm.phoneNumber ||
            !editForm.email
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const dataToSend: any = {
                doctor_id: editForm.doctor_id,
                fullName: editForm.fullName,
                email: editForm.email,
                discipline: editForm.discipline,
                phoneNumber: editForm.phoneNumber,
                avatar: editForm.avatar,
                rating: editForm.rating,
                status: editForm.status,
                experienceYears: editForm.experienceYears
            };
            if (editForm.password) {
                dataToSend.password = editForm.password;
            }
            await axiosInstance.patch(`/doctor/${editForm._id}`, dataToSend);
            setShowEditForm(false);
            setEditForm(null);
            fetchDoctors();
            alert('Doctor update successful!');
        } catch (err: any) {
            if (err?.response?.data?.message?.includes('duplicate key')) {
                alert('Doctor ID or email already exists, please check again!');
            } else {
                alert('Doctor update failed!');
            }
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm(null);
    };

    // -------- Delete Doctor --------
    const handleDeleteDoctor = async (doctorId: string) => {
        if (window.confirm('Are you sure you want to delete this doctor??')) {
            try {
                await axiosInstance.delete(`/doctor/${doctorId}`);
                setDoctorsData(prev => prev.filter(doc => doc._id !== doctorId));
                alert('Doctor deleted successfully!');
            } catch (err: any) {
                alert('Delete doctor failed!');
            }
        }
    };

    // Pagination
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
    }, [searchTerm, sortField, sortOrder]);

    // Sort control
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return (
                <span className='init_sort_icon_admin'>▲</span>
            );
        }
        if (sortOrder === "increase") {
            return (
                <span className='active_sort_icon_admin'>▼</span>
            );
        }
        return (
            <span className='active_sort_icon_admin'>▲</span>
        );
    };

    const handleHeaderClick = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === "increase" ? "decrease" : "increase");
        } else {
            setSortField(field);
            setSortOrder("increase");
        }
    };

    return (
        <div className="doctor_container">
            {/* Header */}
            <div className="doctor_header">
                <div className="doctor_title">List of doctors</div>
                <div className="doctor_controls">
                    <div className="doctor_search_container">
                        <SearchIcon className="doctor_search_icon" />
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
                        <h3>Add new doctor</h3>
                        <input
                            name="doctor_id"
                            placeholder="Doctor ID"
                            value={addForm.doctor_id}
                            readOnly
                            required
                        />
                        <input
                            name="fullName"
                            placeholder="Full name"
                            value={addForm.fullName}
                            onChange={handleAddFormChange}
                            required
                        />
                        <input
                            name="email"
                            type='email'
                            placeholder="Email"
                            value={addForm.email}
                            onChange={handleAddFormChange}
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={addForm.password}
                            onChange={handleAddFormChange}
                            required
                        />
                        <input
                            name="discipline"
                            placeholder="Discipline"
                            value={addForm.discipline}
                            onChange={handleAddFormChange}
                            required
                        />
                        <input
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={addForm.phoneNumber}
                            onChange={handleAddFormChange}
                            required
                        />
                        {/* Image */}
                        <div style={{ marginBottom: 8 }}>
                            <input 
                                type="file" 
                                accept='image/*'
                                onChange={handleAddImageFileChange}
                                disabled={addImageUploading}
                            />
                            {addImageUploading && <span>Uploading...</span>}
                        </div>
                        {/* Show avatar preview */}
                        {addForm.avatar && (
                            <img src={addForm.avatar} alt='avatar' style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #eee', borderRadius: 4 }} />
                        )}

                        <label htmlFor="rating">Rating</label>
                        <input name="rating" type="number" min={1} max={5} step={0.1} placeholder="" value={addForm.rating} onChange={handleAddFormChange} />
                        <input name="status" placeholder="Status" value={addForm.status} onChange={handleAddFormChange} />

                        <label htmlFor="experienceYears">Experience Years</label>
                        <input name="experienceYears" type="number" placeholder="Type..." value={addForm.experienceYears} onChange={handleAddFormChange} />
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
                        <input
                            name="doctor_id"
                            placeholder="Doctor ID"
                            value={editForm.doctor_id}
                            readOnly
                            required
                        />
                        <input
                            name="fullName"
                            placeholder="Full name"
                            value={editForm.fullName}
                            onChange={handleEditFormChange}
                            required
                        />
                        <input
                            name="email"
                            type='email'
                            placeholder="Email"
                            value={editForm.email}
                            onChange={handleEditFormChange}
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password (bỏ trống nếu không đổi)"
                            value={editForm.password || ''}
                            onChange={handleEditFormChange}
                        />
                        <input
                            name="discipline"
                            placeholder="Discipline"
                            value={editForm.discipline}
                            onChange={handleEditFormChange}
                            required
                        />
                        <input
                            name="phoneNumber"
                            placeholder="Phone number"
                            value={editForm.phoneNumber}
                            onChange={handleEditFormChange}
                            required
                        />
                        <input
                            name="rating"
                            type="number"
                            min={1}
                            max={5}
                            step={0.1}
                            placeholder="Rating"
                            value={editForm.rating}
                            onChange={handleEditFormChange}
                        />
                        <input
                            name="status"
                            placeholder="Status"
                            value={editForm.status}
                            onChange={handleEditFormChange}
                        />
                        <input
                            name="experienceYears"
                            type="number"
                            placeholder="Experience years"
                            value={editForm.experienceYears}
                            onChange={handleEditFormChange}
                        />
                        {/* Image */}
                        <div style={{ marginBottom: 8 }}>
                            <input 
                                type="file" 
                                accept='image/*'
                                onChange={handleEditImageFileChange}
                                disabled={editImageUploading}
                            />
                            {editImageUploading && <span>Uploading...</span>}
                        </div>
                        {/* Show avatar preview */}
                        {editForm.avatar && (
                            <img src={editForm.avatar} alt='avatar' style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #eee', borderRadius: 4 }} />
                        )}
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
                        {sortableFields.map(field => (
                            <div
                                key={field.value}
                                className='header_table_admin'
                                onClick={() => handleHeaderClick(field.value)}
                            >
                                {field.label}
                                {renderSortIcon(field.value)}
                            </div>
                        ))}
                        <div>Operation</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="doctor_table_body">
                    {loading ? (
                        <div className="doctor_no_results">Loading...</div>
                    ) : currentDoctors.length > 0 ? (
                        currentDoctors.map((doctor) => (
                            <div key={doctor._id} className="doctor_table_row">
                                <div className="doctor_table_row_grid">
                                    <div>{doctor.doctor_id}</div>
                                    <div>{doctor.fullName}</div>
                                    <div>{doctor.email}</div>
                                    <div>{doctor.phoneNumber}</div>
                                    <div>
                                        {doctor.rating}
                                        <span className="doctor_rating_star">⭐</span>
                                    </div>
                                    <div>{doctor.status}</div>
                                    <div>{doctor.experienceYears}</div>
                                    <div className="doctor_actions">
                                        <button
                                            onClick={() => handleEditDoctor(doctor._id!)}
                                            className="action_button edit_button"
                                            title="Edit Profile"
                                        >
                                            <FixIcon className="action_icon" />
                                            Fix
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doctor._id!)}
                                            className="action_button delete_button"
                                            title="Delete doctor"
                                        >
                                            <DeleteIcon className="action_icon" />
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
                    Show {currentDoctors.length} / {sortedDoctors.length} doctors
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