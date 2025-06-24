import { useEffect, useState } from "react";
import axiosInstance from "../../api/Axios";
import './style.css';
import { DiagnoseType } from "../../types/Types";
import { SearchIcon } from "../../assets/SVG/Svg";

// ----- Sort Type -----
type SortOrder = "increase" | "decrease";

type SortField = 
    | "diagnose_id"
    | "confidence"
    | "description"
    | "prediction"
    | "image"
    | "createdAt"
    | "";

const sortableFields: { label: string; value: SortField }[] = [
    { label: "Diagnose  ID", value: "diagnose_id" },
    { label: "Prediction", value: "prediction" },
    { label: "Description", value: "description" },
    { label: "Confidence", value: "confidence" },
    { label: "Created At", value: "createdAt" },
    { label: "Image", value: "image" },
];

const PatientDiagnose = () => {
    const [diagnoses, setDiagnoses] = useState<DiagnoseType[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>("UNKNOWN");
    // Pagination
    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    // Sort state
    const [sortField, setSortField] = useState<SortField>("");
    const [sortOrder, setSortOrder] = useState<SortOrder>('increase');

    // ----- Fetch patient user id from localStorage -----
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserId(user.id);
            } catch {
                setUserId("UNKNOWN");
            }
        }
    }, []);

    // ----- Fetch all diagnoses for this patient -----
    useEffect(() => {
        const fetchAll = async () => {
            if (userId === "UNKNOWN") return;
            setLoading(true);
            try {
                const diagnosesRes = await axiosInstance.get('/diagnose');
                const diagnoseList: DiagnoseType[] = diagnosesRes.data
                    .filter((d: any) => !d.deleted && d.createdBy === userId)
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
                setDiagnoses(diagnoseList);
            } catch {
                setDiagnoses([]);
            }
            setLoading(false);
        };
        fetchAll();
    }, [userId]);

    // ----- Format Date -----
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    // ----- Filter & Search -----
    const filteredRows = diagnoses.filter(
        (diagnose) =>
            diagnose.diagnose_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnose.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            diagnose.prediction?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ----- Sort -----
    const sortedRows = [...filteredRows].sort((a, b) => {
        let aVal: any, bVal: any;
        // Check the type of the field
        switch (sortField) {
            case "diagnose_id":
                aVal = a.diagnose_id || '';
                bVal = b.diagnose_id || '';
                break;
            case "prediction":
                aVal = a.prediction || '';
                bVal = b.prediction || '';
                break;
            case "description":
                aVal = a.description || '';
                bVal = b.description || '';
                break;
            case "confidence":
                aVal = a.confidence ?? 0;
                bVal = b.confidence ?? 0;
                break;
            case "createdAt":
                aVal = a.createdAt || '';
                bVal = b.createdAt || '';
                break;
            case "image":
                aVal = a.image || '';
                bVal = b.image || '';
                break;
            default:
                return 0;
        }
        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortOrder === "increase"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
            return sortOrder === "increase" ? aVal - bVal : bVal - aVal;
        }
        return 0;
    });

    // ----- Pagination -----
    const totalPages = Math.ceil(sortedRows.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRows = sortedRows.slice(startIndex, endIndex);

    // ----- Pagination Controls -----
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortField, sortOrder]);

    // ----- Sort Icon -----
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return (<span className='init_sort_icon_admin'>▲</span>);
        return sortOrder === "increase"
            ? (<span className='active_sort_icon_admin'>▼</span>)
            : (<span className='active_sort_icon_admin'>▲</span>);
    };

    // Change Sort
    const handleHeaderClick = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "increase" ? "decrease" : "increase");
        } else {
            setSortField(field);
            setSortOrder("increase");
        }
    };

    return (
        <div className="background_diagnose_history">
            <div className="header_diagnose_history">Diagnose History</div>
            {/* Search */}
            <div className="search_container_diagnose_history">
                <SearchIcon className="search_icon_diagnose_history"/>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search_input_diagnose_history"
                />
            </div>
            {/* Table */}
            <div className="table_diagnose_history">
                {/* Header table */}
                <div className="header_table_diagnose_history">
                    {sortableFields.map((field) => (
                        <div
                            key={field.value}
                            onClick={() => handleHeaderClick(field.value)}
                        >
                            {field.label}
                            {renderSortIcon(field.value)}
                        </div>
                    ))}
                </div>
                {/* Body table */}
                <div>
                    {loading ? (
                        <div className="diagnose_loader">Loading...</div>
                    ) : currentRows.length === 0 ? (
                        <div className="empty_diagnose_history">No diagnoses found.</div>
                    ) : (
                        currentRows.map((d) => (
                            <div className="row_diagnose_history" key={d._id}>
                                <div title={d.diagnose_id}>{d.diagnose_id}</div>
                                <div title={d.prediction}>{d.prediction}</div>
                                <div title={d.description}>{d.description || '-'}</div>
                                <div>{d.confidence !== undefined ? `${(d.confidence)}%` : 'N/A'}</div>
                                <div>{formatDate(d.createdAt)}</div>
                                <div>
                                    {d.image ? (
                                        <img
                                            src={d.image}
                                            alt="diagnose"
                                            className="diagnose_img"
                                        />
                                    ) : (
                                        <span style={{ color: '#999' }}>No Image</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Pagination */}
            <div className="diagnose_pagination">
                <div>
                    Show {currentRows.length} / {sortedRows.length} doctors
                </div>
                {totalPages > 1 && (
                    <div className="doctor_pagination">
                        <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination_button">
                            Before
                        </button>
                        {/* Make Array of total pages */}
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

export default PatientDiagnose;