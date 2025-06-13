import { useState, useEffect } from "react";
import axiosInstance from "../../../api/Axios";
import "./Diagnose_Manager.css";

type DiagnoseType = {
    _id: string;
    diagnose_list_id: string;
    lesion_type: string;
    date: string;
    image: string;
    accuracy: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
};

const ITEMS_PER_PAGE = 5;

const emptyForm = {
    diagnose_list_id: "",
    lesion_type: "",
    date: "",
    image: "",
    accuracy: 0,
    rating: 1,
};

const Diagnose_Manager = () => {
    const [diagnoses, setDiagnoses] = useState<DiagnoseType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Add/Edit modal
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [addForm, setAddForm] = useState<any>(emptyForm);
    const [editForm, setEditForm] = useState<any>(null);

    // Fetch diagnoses from backend
    const fetchDiagnoses = () => {
        setLoading(true);
        axiosInstance.get('/diagnose')
            .then(res => {
                setDiagnoses(res.data);
                setLoading(false);
            })
            .catch(() => {
                setDiagnoses([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDiagnoses();
    }, []);

    // Filter
    const filteredDiagnoses = diagnoses.filter(item =>
        (item.diagnose_list_id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (item.lesion_type?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (item.date?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (item.accuracy?.toString().includes(searchTerm.toLowerCase()) || '') ||
        (item.rating?.toString().includes(searchTerm.toLowerCase()) || '')
    );

    // Pagination
    const totalPages = Math.ceil(filteredDiagnoses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentDiagnoses = filteredDiagnoses.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
    const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // Export stub (implement logic if needed)
    const handleExport = () => {
        alert('Export feature is under development!');
    };

    // Add Diagnose
    const handleAddDiagnose = () => setShowAddForm(true);

    const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddForm({
            ...addForm,
            [e.target.name]: e.target.value
        });
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/diagnose', {
                ...addForm,
                accuracy: Number(addForm.accuracy),
                rating: Number(addForm.rating),
            });
            setShowAddForm(false);
            setAddForm(emptyForm);
            fetchDiagnoses();
            alert('Thêm diagnosis thành công!');
        } catch (err: any) {
            alert('Thêm diagnosis thất bại!');
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setAddForm(emptyForm);
    };

    // Edit Diagnose
    const handleEditDiagnose = (item: DiagnoseType) => {
        setEditForm({
            ...item,
            date: item.date ? item.date.slice(0, 10) : "",
        });
        setShowEditForm(true);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.patch(`/diagnose/${editForm._id}`, {
                diagnose_list_id: editForm.diagnose_list_id,
                lesion_type: editForm.lesion_type,
                date: editForm.date,
                image: editForm.image,
                accuracy: Number(editForm.accuracy),
                rating: Number(editForm.rating),
            });
            setShowEditForm(false);
            setEditForm(null);
            fetchDiagnoses();
            alert('Cập nhật diagnosis thành công!');
        } catch (err: any) {
            alert('Cập nhật diagnosis thất bại!');
        }
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditForm(null);
    };

    // Delete Diagnose
    const handleDeleteDiagnose = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa diagnosis này?')) {
            try {
                await axiosInstance.delete(`/diagnose/${id}`);
                setDiagnoses(prev => prev.filter(d => d._id !== id));
                alert('Đã xóa diagnosis thành công!');
            } catch (err: any) {
                alert('Xóa diagnosis thất bại!');
            }
        }
    };

    return (
        <div className="diagnose_manager_container">
            <div className="diagnose_manager_header">
                <div className="diagnose_manager_title">Diagnosis List</div>
            </div>

            <div className="diagnose_manager_toolbar">
                <input
                    type="text"
                    className="diagnose_manager_search_input"
                    placeholder="Search by ID, type, date, accuracy..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="diagnose_manager_toolbar_right">
                    <button className="diagnose_manager_export" onClick={handleExport}>Export</button>
                    <button
                        onClick={handleAddDiagnose}
                        className="diagnose_manager_add_button"
                    >
                        Add new diagnosis
                    </button>
                </div>
            </div>

            {/* Add Diagnose Form */}
            {showAddForm && (
                <div className="diagnose_add_form_overlay">
                    <form className="diagnose_add_form" onSubmit={handleAddFormSubmit}>
                        <h3>Thêm diagnosis mới</h3>
                        <input name="diagnose_list_id" placeholder="Diagnose List ID" value={addForm.diagnose_list_id} onChange={handleAddFormChange} required />
                        <input name="lesion_type" placeholder="Lesion Type" value={addForm.lesion_type} onChange={handleAddFormChange} required />
                        <input name="date" type="date" placeholder="Date" value={addForm.date} onChange={handleAddFormChange} required />
                        <input name="image" placeholder="Image URL" value={addForm.image} onChange={handleAddFormChange} required />
                        <input name="accuracy" type="number" min={0} max={100} placeholder="Accuracy (%)" value={addForm.accuracy} onChange={handleAddFormChange} required />
                        <input name="rating" type="number" min={1} max={5} step={1} placeholder="Rating" value={addForm.rating} onChange={handleAddFormChange} required />
                        <div className="diagnose_add_form_buttons">
                            <button type="submit" className="diagnose_manager_add_button">Lưu</button>
                            <button type="button" className="diagnose_manager_cancel_button" onClick={handleCancelAdd}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Diagnose Form */}
            {showEditForm && editForm && (
                <div className="diagnose_add_form_overlay">
                    <form className="diagnose_add_form" onSubmit={handleEditFormSubmit}>
                        <h3>Cập nhật diagnosis</h3>
                        <input name="diagnose_list_id" placeholder="Diagnose List ID" value={editForm.diagnose_list_id} onChange={handleEditFormChange} required />
                        <input name="lesion_type" placeholder="Lesion Type" value={editForm.lesion_type} onChange={handleEditFormChange} required />
                        <input name="date" type="date" placeholder="Date" value={editForm.date} onChange={handleEditFormChange} required />
                        <input name="image" placeholder="Image URL" value={editForm.image} onChange={handleEditFormChange} required />
                        <input name="accuracy" type="number" min={0} max={100} placeholder="Accuracy (%)" value={editForm.accuracy} onChange={handleEditFormChange} required />
                        <input name="rating" type="number" min={1} max={5} step={1} placeholder="Rating" value={editForm.rating} onChange={handleEditFormChange} required />
                        <div className="diagnose_add_form_buttons">
                            <button type="submit" className="diagnose_manager_add_button">Lưu</button>
                            <button type="button" className="diagnose_manager_cancel_button" onClick={handleCancelEdit}>Hủy</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="diagnose_manager_table">
                {/* Table header */}
                <div className="diagnose_manager_table_header">
                    <div>ID</div>
                    <div>Lesion Image</div>
                    <div>Diagnose Type</div>
                    <div>Date Diagnosed</div>
                    <div>Confidence (%)</div>
                    <div>Rating</div>
                    <div>Operation</div>
                </div>
                {/* Table body */}
                {loading ? (
                    <div className="diagnose_manager_no_results">Loading...</div>
                ) : currentDiagnoses.length === 0 ? (
                    <div className="diagnose_manager_no_results">No diagnoses found.</div>
                ) : (
                    currentDiagnoses.map(item => (
                        <div className="diagnose_manager_table_row" key={item._id}>
                            <div>{item.diagnose_list_id}</div>
                            <div>
                                <img
                                    src={item.image}
                                    alt="Diagnosis"
                                    className="diagnose_manager_image"
                                    onError={e => (e.currentTarget.src = '/no-image.png')}
                                />
                            </div>
                            <div>{item.lesion_type}</div>
                            <div>{item.date && new Date(item.date).toLocaleDateString()}</div>
                            <div>{item.accuracy}%</div>
                            <div className="diagnose_manager_rating">
                                {item.rating}
                                <span className="diagnose_manager_rating_star">★</span>
                            </div>
                            <div className="diagnose_manager_actions">
                                <button
                                    onClick={() => handleEditDiagnose(item)}
                                    className="action_button edit_button"
                                    title="Edit Diagnosis"
                                >
                                    <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Fix
                                </button>
                                <button
                                    onClick={() => handleDeleteDiagnose(item._id)}
                                    className="action_button delete_button"
                                    title="Delete Diagnosis"
                                >
                                    <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary & Pagination in one row */}
            <div className="diagnose_manager_summary_pagination_row">
                <div className="diagnose_manager_summary">
                    Showing {currentDiagnoses.length} / {filteredDiagnoses.length} diagnoses
                </div>
                {totalPages > 1 && (
                    <div className="diagnose_manager_pagination">
                        <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination_button">
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx + 1}
                                onClick={() => handlePageChange(idx + 1)}
                                className={`pagination_button ${currentPage === idx + 1 ? 'active' : ''}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination_button">
                            Next
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

export default Diagnose_Manager;