import { useState, useEffect, ChangeEvent } from "react";
import axiosInstance from "../../../api/Axios";
import "../Doctors/Doctor.css";
import { SearchIcon, DeleteIcon, FixIcon } from "../../../assets/SVG/Svg";

type PatientType = {
  _id: string;
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
  createdBy: string; // ObjectId (_id) của patient
  deleted?: boolean;
};

type RowType = {
  patient: PatientType | null;
  diagnose: DiagnoseType;
};

type SortField =
  | "diagnose_id"
  | "prediction"
  | "description"
  | "confidence"
  | "createdAt"
  | "createdBy"
  | "patientName"
  | "";
type SortOrder = "increase" | "decrease";

const sortableFields: { label: string; value: SortField }[] = [
  { label: "Diagnose ID", value: "diagnose_id" },
  { label: "Prediction", value: "prediction" },
  { label: "Patient Name", value: "patientName" },
  { label: "Description", value: "description" },
  { label: "Confidence", value: "confidence" },
  { label: "Created At", value: "createdAt" },
];


const DiagnoseManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnoses, setDiagnoses] = useState<DiagnoseType[]>([]);
  const [rows, setRows] = useState<RowType[]>([]);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<PatientType[]>([]);

  // Diagnose Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formDiagnose, setFormDiagnose] = useState<Partial<DiagnoseType>>({});
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<SortField>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("increase");
  const [addImageUploading, setAddImageUploading] = useState(false);
  const [editImageUploading, setEditImageUploading] = useState(false);
  // Fetch all diagnoses & patients
  useEffect(() => {
    fetchDiagnoses();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get("/patient");
      const patientList: PatientType[] = res.data.map((pat: any) => ({
        _id: pat._id,
        patient_id: pat.patient_id,
        fullName: pat.fullName,
        email: pat.email,
      }));
      setPatients(patientList);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatients([]);
    }
  };

  const fetchDiagnoses = async () => {
    setLoading(true);
    try {
      const diagnosesRes = await axiosInstance.get("/diagnose");
      const diagnoseList: DiagnoseType[] = diagnosesRes.data
        // .filter((d: any) => !d.deleted)
        .map((diag: any) => ({
          _id: diag._id,
          diagnose_id: diag.diagnose_id,
          prediction: diag.prediction,
          image: diag.image,
          description: diag.description,
          confidence: diag.confidence,
          createdAt: diag.createdAt,
          createdBy: diag.createdBy, // ObjectId của patient
          deleted: diag.deleted,
        }));
      setDiagnoses(diagnoseList);
    } catch (error) {
      console.error("Failed to fetch diagnoses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter/search
  const filteredRows = rows.filter(
    (row) =>
      row.diagnose.diagnose_id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      "" ||
      row.diagnose.prediction
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      "" ||
      row.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "" ||
      row.diagnose.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ""
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

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = sortedRows.slice(startIndex, endIndex);

  // Add Diagnose
  const handleAddDiagnose = async () => {
    try {
      // Gọi API để lấy next ID
      const response = await axiosInstance.get("/diagnose/next-id");
      const nextId = response.data;

      setFormDiagnose({
        diagnose_id: nextId,
        prediction: "",
        image: "",
        description: "",
        confidence: undefined,
        createdBy: "",
      });
      setShowAddForm(true);
    } catch (error) {
      console.error("Error getting next ID:", error);
      alert("Failed to generate next ID. Please try again.");
    }
  };
  const handleAddFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormDiagnose((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formDiagnose.diagnose_id ||
      !formDiagnose.prediction ||
      !formDiagnose.createdBy
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await axiosInstance.post("/diagnose", formDiagnose);
      setShowAddForm(false);
      window.location.reload();
    } catch {
      alert("Add diagnose failed!");
    }
  };
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setFormDiagnose({});
  };

  // Image upload for Add form
  const handleAddImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormDiagnose(prev => ({ ...prev, image: res.data.url }));
    } catch (err) {
      alert('Upload image failed!');
    }
    setAddImageUploading(false);
  };

  // Edit Diagnose
  const handleEditDiagnose = (row: RowType) => {
    setFormDiagnose({ ...row.diagnose });
    setShowEditForm(true);
  };
  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormDiagnose((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formDiagnose._id ||
      !formDiagnose.diagnose_id ||
      !formDiagnose.prediction ||
      !formDiagnose.createdBy
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await axiosInstance.patch(
        `/diagnose/${formDiagnose.diagnose_id}`,
        formDiagnose
      );
      setShowEditForm(false);
      window.location.reload();
    } catch {
      alert("Update diagnose failed!");
    }
  };
  const handleCancelEdit = () => {
    setShowEditForm(false);
    setFormDiagnose({});
  };

  // Image upload for Edit form
  const handleEditImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormDiagnose(prev => ({ ...prev, image: res.data.url }));
    } catch (err) {
      alert('Upload image failed!');
    }
    setEditImageUploading(false);
  };

  // Delete Diagnose
  const handleDeleteDiagnose = async (row: RowType) => {
    if (!row.diagnose.diagnose_id) return;
    if (window.confirm("Are you sure you want to delete this diagnose?")) {
      try {
        await axiosInstance.delete(`/diagnose/${row.diagnose.diagnose_id}`);
        window.location.reload();
      } catch {
        alert("Delete diagnose failed!");
      }
    }
  };

  // Pagination controls
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

  // Sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <span className="init_sort_icon_admin">▲</span>;
    if (sortOrder === "increase")
      return <span className="active_sort_icon_admin">▼</span>;
    return <span className="active_sort_icon_admin">▲</span>;
  };

  const handleHeaderClick = (field: SortField) => {
    if (sortField === field)
      setSortOrder((prev) => (prev === "increase" ? "decrease" : "increase"));
    else {
      setSortField(field);
      setSortOrder("increase");
    }
  };
  // Create patient name lookup function
  const getPatientName = (createdBy: string) => {
    const patient = patients.find((p) => p._id === createdBy);
    return patient?.fullName || "Unknown";
  };

  // Update rows when diagnoses or patients change
  useEffect(() => {
    const allRows: RowType[] = diagnoses.map((diagnose) => ({
      diagnose,
      patient: patients.find((p) => p._id === diagnose.createdBy) || null,
    }));
    setRows(allRows);
  }, [diagnoses, patients]);

  // Lấy danh sách patients cho form add/edit
  const patientsForSelect = patients;

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
          <button onClick={handleAddDiagnose} className="doctor_add_button">
            Add new diagnose
          </button>
        </div>
      </div>

      {/* Add Diagnose Form */}
      {showAddForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
            <h3>Add new diagnose</h3>
            <input
              name="diagnose_id"
              placeholder="Diagnose ID"
              value={formDiagnose.diagnose_id || ""}
              readOnly
              required
            />
            <select
              name="createdBy"
              value={formDiagnose.createdBy || ""}
              onChange={handleAddFormChange}
              required
            >
              <option value="">-- Select Patient --</option>
              {patientsForSelect.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.patient_id} - {p.fullName}
                </option>
              ))}
            </select>
            <input
              name="prediction"
              placeholder="Prediction"
              value={formDiagnose.prediction || ""}
              onChange={handleAddFormChange}              required
            />
            {/* Image upload */}
            <div style={{ marginBottom: 8 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImageFileChange}
                disabled={addImageUploading}
                title="Upload diagnose image"
              />
              {addImageUploading && <span>Uploading...</span>}
            </div>
            {/* Show preview */}
            {formDiagnose.image && (
              <img 
                src={formDiagnose.image} 
                alt="preview" 
                style={{ 
                  width: 80, 
                  height: 80, 
                  objectFit: 'cover', 
                  border: '1px solid #eee', 
                  borderRadius: 4,
                  marginBottom: 8 
                }} 
              />
            )}
            <textarea
              name="description"
              placeholder="Description"
              value={formDiagnose.description || ""}
              onChange={handleAddFormChange}
            />
            <input
              name="confidence"
              type="number"
              step="0.01"
              placeholder="Confidence"
              value={
                formDiagnose.confidence === undefined
                  ? ""
                  : formDiagnose.confidence
              }
              onChange={handleAddFormChange}
            />
            <div className="doctor_add_form_buttons">
              <button type="submit" className="doctor_add_button">
                Save
              </button>
              <button
                type="button"
                className="doctor_cancel_button"
                onClick={handleCancelAdd}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Diagnose Form */}
      {showEditForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
            <h3>Edit diagnose</h3>
            <input
              name="diagnose_id"
              placeholder="Diagnose ID"
              value={formDiagnose.diagnose_id || ""}
              readOnly
              required
            />
            <select
              name="createdBy"
              value={formDiagnose.createdBy || ""}
              onChange={handleEditFormChange}
              required
            >
              <option value="">-- Select Patient --</option>
              {patientsForSelect.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.patient_id} - {p.fullName}
                </option>
              ))}
            </select>
            <input
              name="prediction"
              placeholder="Prediction"
              value={formDiagnose.prediction || ""}
              onChange={handleEditFormChange}              required
            />
            {/* Image upload */}
            <div style={{ marginBottom: 8 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageFileChange}
                disabled={editImageUploading}
                title="Upload diagnose image"
              />
              {editImageUploading && <span>Uploading...</span>}
            </div>
            {/* Show preview */}
            {formDiagnose.image && (
              <img 
                src={formDiagnose.image} 
                alt="preview" 
                style={{ 
                  width: 80, 
                  height: 80, 
                  objectFit: 'cover', 
                  border: '1px solid #eee', 
                  borderRadius: 4,
                  marginBottom: 8 
                }} 
              />
            )}
            <textarea
              name="description"
              placeholder="Description"
              value={formDiagnose.description || ""}
              onChange={handleEditFormChange}
            />
            <input
              name="confidence"
              type="number"
              step="0.01"
              placeholder="Confidence"
              value={
                formDiagnose.confidence === undefined
                  ? ""
                  : formDiagnose.confidence
              }
              onChange={handleEditFormChange}
            />
            <div className="doctor_add_form_buttons">
              <button type="submit" className="doctor_add_button">
                Save
              </button>
              <button
                type="button"
                className="doctor_cancel_button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="doctor_table">
        <div className="doctor_table_header">
          <div className="doctor_table_header_grid">
            {sortableFields.map((field) => (
              <div
                key={field.value}
                className="header_table_admin"
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
            currentRows.map((row) => (
              <div key={row.diagnose.diagnose_id} className="doctor_table_row">
                <div className="doctor_table_row_grid">
                  <div>{row.diagnose.diagnose_id}</div>
                  <div>{row.diagnose.prediction}</div>
                  <div>{row.patient?.fullName || <i>Unknown</i>}</div>
                  <div>{row.diagnose.description || "-"}</div>
                  <div>
                    {row.diagnose.confidence !== undefined
                      ? row.diagnose.confidence
                      : "-"}
                  </div>
                  <div>
                    {row.diagnose.createdAt
                      ? new Date(row.diagnose.createdAt).toLocaleString()
                      : "-"}
                  </div>
                  <div>
                    {row.diagnose.image ? (
                      <img
                        src={row.diagnose.image}
                        alt="diagnose"
                        style={{
                          maxWidth: 60,
                          maxHeight: 60,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "-"
                    )}
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
            <div className="doctor_no_results">No suitable row found</div>
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
                className={`pagination_button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
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

export default DiagnoseManager;
