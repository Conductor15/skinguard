import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';
import '../doctors/Doctor.css';
import { PatientType } from '../../../types/Types';
import { SearchIcon, DeleteIcon, FixIcon } from '../../../assets/SVG/Svg';

type SortField = keyof PatientType | '';
type SortOrder = 'increase' | 'decrease';

// Generate a unique ID for a new patient
function getNextPatientId(patients: PatientType[]): string {
  const prefix = 'PAT';
  const usedNumbers = patients
    .map(p => p.patient_id)
    .filter((id): id is string => !!id && id.startsWith(prefix)) 
    .map(id => parseInt(id.replace(prefix, ''), 10))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);

  let nextNum = 1;
  for (let num of usedNumbers) {
    if (num === nextNum) nextNum++;
    else break;
  }
  return prefix + nextNum.toString().padStart(3, '0');
}

const sortableFields: { label: string, value: SortField }[] = [
  { label: "ID", value: "patient_id" },
  { label: "Full Name", value: "fullName" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Avatar", value: "avatar" },
  { label: "Status", value: "status" },
  { label: "Birth Day", value: "birthDay" }
];

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

export default function Patient() {
  const [patients, setPatients] = useState<(PatientType & { birthDay: string; _id?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add/Edit/Delete Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [addForm, setAddForm] = useState<PatientType & { birthDay: string }>(defaultPatient);
  const [editForm, setEditForm] = useState<(PatientType & { birthDay: string; _id?: string })>({ ...defaultPatient, _id: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Image upload
  const [addImageUploading, setAddImageUploading] = useState(false);
  const [editImageUploading, setEditImageUploading] = useState(false);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('increase');

  // Fetch patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/patient');
      setPatients(res.data);
    } catch {
      setPatients([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter and sort
  const filteredPatients = patients.filter(patient =>
    (patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (patient.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (patient.avatar?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (patient.status?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (patient.birthDay?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
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
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = sortedPatients.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, sortField, sortOrder]);

  // Add/Edit/Delete handlers
  const handleAddPatient = () => {
    setAddForm({
      ...defaultPatient,
      patient_id: getNextPatientId(patients)
    });
    setShowAddForm(true);
  };

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

  const handleDeletePatient = async (patient: PatientType & { birthDay: string; _id?: string }) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    setLoading(true);
    try {
      if (patient._id) {
        await axiosInstance.delete(`/patient/${patient._id}`);
        await fetchPatients();
      }
      setLoading(false);
    } catch {
      setLoading(false);
      alert('Delete failed!');
    }
  };

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    // Validate required fields
    if (!addForm.fullName || !addForm.email || !addForm.password || !addForm.phone || !addForm.birthDay) {
      alert('Please fill all required fields!');
      setAddLoading(false);
      return;
    }

    try {
      await axiosInstance.post('/patient', addForm);
      setShowAddForm(false);
      await fetchPatients();
    } catch (e: any) {
      if (e?.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        alert("Add patient failed!");
      }
    }
    setAddLoading(false);
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      if (editForm._id) {
        const dataToSend = { ...editForm };
        if (!dataToSend.password) delete dataToSend.password;
        await axiosInstance.patch(`/patient/${editForm._id}`, dataToSend);
      }
      setShowEditForm(false);
      await fetchPatients();
    } catch (e: any) {
      if (e?.response?.data?.message) {
        alert(e.response.data.message);
      } else {
        alert("Update failed!");
      }
    }
    setEditLoading(false);
  };

  const handleCancelAdd = () => setShowAddForm(false);
  const handleCancelEdit = () => setShowEditForm(false);

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

  // Sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return (<span className='init_sort_icon_admin'>▲</span>);
    return sortOrder === "increase" 
      ? (<span className='active_sort_icon_admin'>▼</span>)
      : (<span className='active_sort_icon_admin'>▲</span>);
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
      <div className="doctor_header">
        <div className="doctor_title">List of patients</div>
        <div className="doctor_controls">
          <div className="doctor_search_container">
            <SearchIcon className="doctor_search_icon" />
            <input
              type="text"
              placeholder="Find by id, name, email, phone, avatar, status, birthDay..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="doctor_search_input"
            />
          </div>
          <button onClick={handleAddPatient} className="doctor_add_button">
            Add new patient
          </button>
        </div>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
            <h3>Add new patient</h3>
            <input name="patient_id" placeholder="Patient ID" value={addForm.patient_id} readOnly required />
            <input name="fullName" placeholder="Full Name" value={addForm.fullName} onChange={handleAddFormChange} required />
            <input name="email" type="email" placeholder="Email" value={addForm.email} onChange={handleAddFormChange} required />
            <input name="password" type="password" placeholder="Password" value={addForm.password} onChange={handleAddFormChange} required />
            <input name="phone" placeholder="Phone number" value={addForm.phone} onChange={handleAddFormChange} required />
            <input name="birthDay" type="date" placeholder="Birth Day" value={addForm.birthDay} onChange={handleAddFormChange} required />
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
            {addForm.avatar && <img src={addForm.avatar} alt="avatar" style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #eee', borderRadius: 4 }}/>}
            <input name="status" placeholder="Status" value={addForm.status} onChange={handleAddFormChange} />
            <div className="doctor_add_form_buttons">
              <button type="submit" className="doctor_add_button" disabled={addLoading}>
                {addLoading ? "Saving..." : "Save"}
              </button>
              <button type="button" className="doctor_cancel_button" onClick={handleCancelAdd} disabled={addLoading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
            <input name="birthDay" type="date" placeholder="Birth Day" value={editForm.birthDay} onChange={handleEditFormChange} required />
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
            <div>Operation</div>
          </div>
        </div>
        <div className="doctor_table_body">
          {loading ? (
            <div className="doctor_no_results">Loading...</div>
          ) : currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <div key={patient._id} className="doctor_table_row">
                <div className="doctor_table_row_grid">
                  <div>{patient.patient_id}</div>
                  <div>{patient.fullName}</div>
                  <div>{patient.email}</div>
                  <div>{patient.phone}</div>
                  <div>
                    {patient.avatar
                      ? <img src={patient.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid #ccc" }} />
                      : <span>No Avatar</span>
                    }
                  </div>
                  <div>{patient.status}</div>
                  <div>{patient.birthDay}</div>
                  <div className="doctor_actions">
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="action_button edit_button"
                      title="Edit Patient"
                    >
                      <FixIcon className="action_icon" />
                      Fix
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient)}
                      className="action_button delete_button"
                      title="Delete Patient"
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
              No suitable patient found
            </div>
          )}
        </div>
      </div>
      <div className="doctor_summary">
        <div>
          Show {currentPatients.length} / {sortedPatients.length} patients
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
}