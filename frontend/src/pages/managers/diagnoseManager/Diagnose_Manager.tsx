import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';
import '../Doctors/Doctor.css';
import { SearchIcon, DeleteIcon, FixIcon } from '../../../assets/SVG/Svg';

type PatientType = {
    patient_id: string;
    fullName: string;
    email: string;
};

type DiagnoseType = {
    _id?: string;
    diagnose_id: string;
    prediction: string;
    image?: string;
    description?: string;
    confidence?: number;
    createdAt?: string;
    createdBy: string; // patient_id
    deleted?: boolean;
};

type RowType = {
    patient: PatientType | null;
    diagnose: DiagnoseType;
};

type SortField = 'diagnose_id' | 'prediction' | 'description' | 'confidence' | 'createdAt' | 'createdBy' | 'patientName' | '';
type SortOrder = 'increase' | 'decrease';

const sortableFields: { label: string, value: SortField }[] = [
    { label: "Diagnose ID", value: "diagnose_id" },
    { label: "Prediction", value: "prediction" },
    { label: "Patient Name", value: "patientName" },
    { label: "Description", value: "description" },
    { label: "Confidence", value: "confidence" },
    { label: "Created At", value: "createdAt" },
];

function getNextDiagnoseId(diagnoses: DiagnoseType[]): string {
    const prefix = "DGN";
    const usedNumbers = diagnoses
        .map(d => d.diagnose_id)
        .filter(id => id && id.startsWith(prefix))
        .map(id => parseInt(id.replace(prefix, ""), 10))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    let nextNum = 1;
    for (let num of usedNumbers) {
        if (num === nextNum) nextNum++;
        else break;
    }
    return prefix + nextNum.toString().padStart(4, "0");
}

const DiagnoseManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [patients, setPatients] = useState<PatientType[]>([]);
    const [diagnoses, setDiagnoses] = useState<DiagnoseType[]>([]);
    const [rows, setRows] = useState<RowType[]>([]);
    const [loading, setLoading] = useState(false);

    // Diagnose Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formDiagnose, setFormDiagnose] = useState<Partial<DiagnoseType>>({});
    const itemsPerPage = 5;
    const [sortField, setSortField] = useState<SortField>('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('increase');

    // Fetch all patients & diagnoses
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const patientsRes = await axiosInstance.get('/patient');
                const diagnosesRes = await axiosInstance.get('/diagnose');
                const patientList: PatientType[] = patientsRes.data.map((pat: any) => ({
                    patient_id: pat.patient_id,
                    fullName: pat.fullName,
                    email: pat.email,
                }));
                const diagnoseList: DiagnoseType[] = diagnosesRes.data
                    .filter((d: any) => !d.deleted)
                    .map((diag: any) => ({
                        _id: diag._id,
                        diagnose_id: diag.diagnose_id,
                        prediction: diag.prediction,
                        image: diag.image,
                        description: diag.description,
                        confidence: diag.confidence,
                        createdAt: diag.createdAt,
                        createdBy: diag.createdBy,
                        deleted: diag.deleted,
                    }));
                setPatients(patientList);
                setDiagnoses(diagnoseList);

                // Gắn patient cho mỗi diagnose
                let allRows: RowType[] = diagnoseList.map(diagnose => ({
                    diagnose,
                    patient: patientList.find(p => p.patient_id === diagnose.createdBy) || null
                }));
                setRows(allRows);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Filter/search
    const filteredRows = rows.filter(row =>
        (row.diagnose.diagnose_id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (row.diagnose.prediction?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (row.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (row.diagnose.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    // Sort
    const sortedRows = [...filteredRows].sort((a, b) => {
        let aVal: any, bVal: any;
        switch (sortField) {
            case "diagnose_id":
                aVal = a.diagnose.diagnose_id || "";
                bVal = b.diagnose.diagnose_id || "";
                break;
            case "prediction":
                aVal = a.diagnose.prediction || "";
                bVal = b.diagnose.prediction || "";
                break;
            case "patientName":
                aVal = a.patient?.fullName || "";
                bVal = b.patient?.fullName || "";
                break;
            case "description":
                aVal = a.diagnose.description || "";
                bVal = b.diagnose.description || "";
                break;
            case "confidence":
                aVal = a.diagnose.confidence ?? 0;
                bVal = b.diagnose.confidence ?? 0;
                break;
            case "createdAt":
                aVal = a.diagnose.createdAt || "";
                bVal = b.diagnose.createdAt || "";
                break;
            default:
                return 0;
        }
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
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedRows.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRows = sortedRows.slice(startIndex, endIndex);

    // ---- CRUD for Diagnose ----

    // Add Diagnose
    const handleAddDiagnose = () => {
        setFormDiagnose({
            diagnose_id: getNextDiagnoseId(diagnoses),
            prediction: '',
            image: '',
            description: '',
            confidence: undefined,
            createdBy: '',
        });
        setShowAddForm(true);
    };
    const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormDiagnose(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };
    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formDiagnose.diagnose_id || !formDiagnose.prediction || !formDiagnose.createdBy) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            await axiosInstance.post('/diagnose', formDiagnose);
            setShowAddForm(false);
            window.location.reload();
        } catch {
            alert('Add diagnose failed!');
        }
    };
    const handleCancelAdd = () => {
        setShowAddForm(false);
        setFormDiagnose({});
    };

    // Edit Diagnose
    const handleEditDiagnose = (row: RowType) => {
        setFormDiagnose({ ...row.diagnose });
        setShowEditForm(true);
    };
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormDiagnose(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };
    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formDiagnose._id || !formDiagnose.diagnose_id || !formDiagnose.prediction || !formDiagnose.createdBy) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            await axiosInstance.patch(`/diagnose/${formDiagnose.diagnose_id}`, formDiagnose);
            setShowEditForm(false);
            window.location.reload();
        } catch {
            alert('Update diagnose failed!');
        }
    };
    const handleCancelEdit = () => {
        setShowEditForm(false);
        setFormDiagnose({});
    };

    // Delete Diagnose
    const handleDeleteDiagnose = async (row: RowType) => {
        if (!row.diagnose.diagnose_id) return;
        if (window.confirm('Are you sure you want to delete this diagnose?')) {
            try {
                await axiosInstance.delete(`/diagnose/${row.diagnose.diagnose_id}`);
                window.location.reload();
            } catch {
                alert('Delete diagnose failed!');
            }
        }
    };

    // Pagination controls
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
    const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

    useEffect(() => { setCurrentPage(1); }, [searchTerm, sortField, sortOrder]);

    // Sort icon
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return <span className='init_sort_icon_admin'>▲</span>;
        if (sortOrder === "increase") return <span className='active_sort_icon_admin'>▼</span>;
        return <span className='active_sort_icon_admin'>▲</span>;
    };

    const handleHeaderClick = (field: SortField) => {
        if (sortField === field) setSortOrder(prev => prev === "increase" ? "decrease" : "increase");
        else { setSortField(field); setSortOrder("increase"); }
    };

    return (
        <div className="doctor_container">
            {/* Header */}
            <div className="doctor_header">
                <div className="doctor_title">Diagnoses Management</div>
                <div className="doctor_controls">
                    <div className="doctor_search_container">
                        <SearchIcon className="doctor_search_icon" />
                        <input
                            type="text"
                            placeholder="Find a diagnose..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="doctor_search_input"
                        />
                    </div>
                    <button
                        onClick={handleAddDiagnose}
                        className="doctor_add_button"
                    >
                        Add new diagnose
                    </button>
                </div>
            </div>

            {/* Add Diagnose Form */}
            {showAddForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
                        <h3>Add new diagnose</h3>
                        <input name="diagnose_id" placeholder="Diagnose ID" value={formDiagnose.diagnose_id || ''} readOnly required />
                        <select
                            name="createdBy"
                            value={formDiagnose.createdBy || ""}
                            onChange={handleAddFormChange}
                            required
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.map(p =>
                                <option key={p.patient_id} value={p.patient_id}>
                                    {p.patient_id} - {p.fullName}
                                </option>
                            )}
                        </select>
                        <input name="prediction" placeholder="Prediction" value={formDiagnose.prediction || ''} onChange={handleAddFormChange} required />
                        <input name="image" placeholder="Image URL" value={formDiagnose.image || ''} onChange={handleAddFormChange} />
                        <textarea name="description" placeholder="Description" value={formDiagnose.description || ''} onChange={handleAddFormChange} />
                        <input name="confidence" type="number" step="0.01" placeholder="Confidence" value={formDiagnose.confidence === undefined ? '' : formDiagnose.confidence} onChange={handleAddFormChange} />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Save</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelAdd}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Diagnose Form */}
            {showEditForm && (
                <div className="doctor_add_form_overlay">
                    <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
                        <h3>Edit diagnose</h3>
                        <input name="diagnose_id" placeholder="Diagnose ID" value={formDiagnose.diagnose_id || ''} readOnly required />
                        <select
                            name="createdBy"
                            value={formDiagnose.createdBy || ""}
                            onChange={handleEditFormChange}
                            required
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.map(p =>
                                <option key={p.patient_id} value={p.patient_id}>
                                    {p.patient_id} - {p.fullName}
                                </option>
                            )}
                        </select>
                        <input name="prediction" placeholder="Prediction" value={formDiagnose.prediction || ''} onChange={handleEditFormChange} required />
                        <input name="image" placeholder="Image URL" value={formDiagnose.image || ''} onChange={handleEditFormChange} />
                        <textarea name="description" placeholder="Description" value={formDiagnose.description || ''} onChange={handleEditFormChange} />
                        <input name="confidence" type="number" step="0.01" placeholder="Confidence" value={formDiagnose.confidence === undefined ? '' : formDiagnose.confidence} onChange={handleEditFormChange} />
                        <div className="doctor_add_form_buttons">
                            <button type="submit" className="doctor_add_button">Save</button>
                            <button type="button" className="doctor_cancel_button" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="doctor_table">
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
                        <div>Image</div>
                        <div>Operation</div>
                    </div>
                </div>
                <div className="doctor_table_body">
                    {loading ? (
                        <div className="doctor_no_results">Loading...</div>
                    ) : currentRows.length > 0 ? (
                        currentRows.map((row, i) => (
                            <div key={row.diagnose.diagnose_id} className="doctor_table_row">
                                <div className="doctor_table_row_grid">
                                    <div>{row.diagnose.diagnose_id}</div>
                                    <div>{row.diagnose.prediction}</div>
                                    <div>{row.patient?.fullName || <i>Unknown</i>}</div>
                                    <div>{row.diagnose.description || '-'}</div>
                                    <div>{row.diagnose.confidence !== undefined ? row.diagnose.confidence : '-'}</div>
                                    <div>{row.diagnose.createdAt ? new Date(row.diagnose.createdAt).toLocaleString() : '-'}</div>
                                    <div>
                                        {row.diagnose.image
                                            ? <img src={row.diagnose.image} alt="diagnose" style={{ maxWidth: 60, maxHeight: 60, objectFit: 'cover' }} />
                                            : '-'}
                                    </div>
                                    <div className="doctor_actions">
                                        <button
                                            onClick={() => handleEditDiagnose(row)}
                                            className="action_button edit_button"
                                            title="Edit Diagnose"
                                        >
                                            <FixIcon className="action_icon" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDiagnose(row)}
                                            className="action_button delete_button"
                                            title="Delete Diagnose"
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
                            No suitable row found
                        </div>
                    )}
                </div>
            </div>

            {/* Summary and Pagination */}
            <div className="doctor_summary">
                <div>
                    Show {currentRows.length} / {sortedRows.length} rows
                </div>
                {totalPages > 1 && (
                    <div className="doctor_pagination">
                        <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination_button">
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
                        <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination_button">
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

export default DiagnoseManager;