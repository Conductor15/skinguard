import '../doctors/Doctor.css';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../api/Axios';

type DoctorType = {
  _id: string;
  fullName: string;
  consult_list_id: string[];
};
type ConsultType = {
  _id: string;
  consult_id: string;
  patient_id: string | { _id: string };
  date: string;
};
type PatientType = {
  _id?: string;
  patient_id: string;
  fullName: string;
  orderID?: string;
  diagnose_id_list?: string[];
  email?: string;
  password?: string;
  birthDay?: string;
  avatar?: string;
};

type RowType = {
  _id?: string;
  consult_id: string;
  date: string;
  doctor_name: string;
  fullName: string;
  order_id: string;
  diagnose_id_list: string;
};

const defaultPatient: PatientType = {
  patient_id: '',
  fullName: '',
  orderID: '',
  diagnose_id_list: [],
  email: '',
  password: '',
  birthDay: '',
  avatar: '',
};

export default function Patient() {
  const [rows, setRows] = useState<RowType[]>([]);
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add/Edit/Delete form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [addForm, setAddForm] = useState<PatientType>(defaultPatient);
  const [editForm, setEditForm] = useState<PatientType>({...defaultPatient, _id: ''});
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch doctors, consults, patients, and join
  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line
  }, []);

  const fetchRows = async () => {
    setLoading(true);
    try {
      // Get all patients so we can edit/delete by _id
      const allPatientsRes = await axiosInstance.get('/patient');
      setPatients(allPatientsRes.data);

      const doctorRes = await axiosInstance.get('/doctor');
      const doctors: DoctorType[] = doctorRes.data;
      const tempRows: RowType[] = [];

      await Promise.all(
        doctors.map(async (doctor) => {
          await Promise.all(
            (doctor.consult_list_id || []).map(async (consultId) => {
              try {
                // Get consult
                const consultRes = await axiosInstance.get(`/consult/${consultId}`);
                const consult: ConsultType = consultRes.data;
                // Get patient id string
                let patient_id = '';
                if (typeof consult.patient_id === 'string') patient_id = consult.patient_id;
                else if (typeof consult.patient_id === 'object' && consult.patient_id !== null && '_id' in consult.patient_id)
                  patient_id = (consult.patient_id as any)._id;
                if (!patient_id) return;
                // Get patient
                const patientRes = await axiosInstance.get(`/patient/${patient_id}`);
                const patient: PatientType = patientRes.data;
                tempRows.push({
                  _id: patient._id,
                  consult_id: consult.consult_id || consult._id,
                  date: consult.date ? new Date(consult.date).toLocaleDateString('en-CA') : '',
                  doctor_name: doctor.fullName,
                  fullName: patient.fullName,
                  order_id: patient.orderID || "",
                  diagnose_id_list: Array.isArray(patient.diagnose_id_list) ? patient.diagnose_id_list.join(', ') : "",
                });
              } catch {}
            })
          );
        })
      );

      setRows(tempRows);
    } catch {
      setRows([]);
      setPatients([]);
    }
    setLoading(false);
  };

  // Search & Pagination
  const filteredRows = rows.filter(row =>
    (row.doctor_name && row.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.consult_id && row.consult_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.fullName && row.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.order_id && row.order_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.diagnose_id_list && row.diagnose_id_list.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.date && row.date.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // Add/Edit/Delete handlers
  const handleAddPatient = () => {
    setAddForm(defaultPatient);
    setShowAddForm(true);
  };

  const handleEditPatient = (row: RowType) => {
    // Find the patient with this fullName in all patients (for _id)
    const patient = patients.find((p) => p.fullName === row.fullName && p.orderID === row.order_id);
    setEditForm({
      _id: patient?._id || '',
      patient_id: patient?.patient_id || '',
      fullName: patient?.fullName || '',
      email: patient?.email || '',
      password: '',
      birthDay: patient?.birthDay || '',
      avatar: patient?.avatar || '',
      orderID: patient?.orderID || '',
      diagnose_id_list: patient?.diagnose_id_list || [],
    });
    setShowEditForm(true);
  };

  const handleDeletePatient = async (row: RowType) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bệnh nhân này?')) return;
    setLoading(true);
    try {
      // Find _id from rows (from patient)
      if (row._id) {
        await axiosInstance.delete(`/patient/${row._id}`);
        await fetchRows();
      }
      setLoading(false);
    } catch {
      setLoading(false);
      alert('Xóa thất bại!');
    }
  };

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAddFormDiagnoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm(prev => ({
      ...prev,
      diagnose_id_list: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
    }));
  };
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEditFormDiagnoseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({
      ...prev,
      diagnose_id_list: e.target.value.split(",").map(v => v.trim()).filter(Boolean)
    }));
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await axiosInstance.post('/patient', addForm);
      setShowAddForm(false);
      await fetchRows();
    } catch {
      alert("Thêm bệnh nhân thất bại!");
    }
    setAddLoading(false);
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      if (editForm._id) {
        await axiosInstance.patch(`/patient/${editForm._id}`, editForm);
      }
      setShowEditForm(false);
      await fetchRows();
    } catch {
      alert("Cập nhật thất bại!");
    }
    setEditLoading(false);
  };

  const handleCancelAdd = () => setShowAddForm(false);
  const handleCancelEdit = () => setShowEditForm(false);

  return (
    <div className="doctor_container">
      <div className="doctor_header">
        <div className="doctor_title">Patient - Doctor Join Table</div>
        <div className="doctor_controls">
          <div className="doctor_search_container">
            <svg className="doctor_search_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Find by doctor, consult, patient, order, diagnose..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="doctor_search_input"
            />
          </div>
          <button
            onClick={handleAddPatient}
            className="doctor_add_button"
          >
            Add new patient
          </button>
        </div>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
            <h3>Thêm bệnh nhân mới</h3>
            <input name="patient_id" placeholder="Patient ID" value={addForm.patient_id} onChange={handleAddFormChange} required />
            <input name="fullName" placeholder="Full Name" value={addForm.fullName} onChange={handleAddFormChange} required />
            <input name="email" type="email" placeholder="Email" value={addForm.email || ""} onChange={handleAddFormChange} />
            <input name="birthDay" placeholder="BirthDay" value={addForm.birthDay || ""} onChange={handleAddFormChange} />
            <input name="avatar" placeholder="Avatar URL" value={addForm.avatar || ""} onChange={handleAddFormChange} />
            <input name="orderID" placeholder="Order ID" value={addForm.orderID || ""} onChange={handleAddFormChange} />
            <input name="diagnose_id_list" placeholder="Diagnose List IDs (comma separated)" value={addForm.diagnose_id_list?.join(", ") || ""} onChange={handleAddFormDiagnoseChange} />
            <input name="password" type="password" placeholder="Password" value={addForm.password || ""} onChange={handleAddFormChange} />
            <div className="doctor_add_form_buttons">
              <button type="submit" className="doctor_add_button" disabled={addLoading}>
                {addLoading ? "Đang lưu..." : "Lưu"}
              </button>
              <button type="button" className="doctor_cancel_button" onClick={handleCancelAdd} disabled={addLoading}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Patient Form */}
      {showEditForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
            <h3>Cập nhật bệnh nhân</h3>
            <input name="patient_id" placeholder="Patient ID" value={editForm.patient_id} onChange={handleEditFormChange} required />
            <input name="fullName" placeholder="Full Name" value={editForm.fullName} onChange={handleEditFormChange} required />
            <input name="email" type="email" placeholder="Email" value={editForm.email || ""} onChange={handleEditFormChange} />
            <input name="birthDay" placeholder="BirthDay" value={editForm.birthDay || ""} onChange={handleEditFormChange} />
            <input name="avatar" placeholder="Avatar URL" value={editForm.avatar || ""} onChange={handleEditFormChange} />
            <input name="orderID" placeholder="Order ID" value={editForm.orderID || ""} onChange={handleEditFormChange} />
            <input name="diagnose_id_list" placeholder="Diagnose List IDs (comma separated)" value={editForm.diagnose_id_list?.join(", ") || ""} onChange={handleEditFormDiagnoseChange} />
            <input name="password" type="password" placeholder="Password" value={editForm.password || ""} onChange={handleEditFormChange} />
            <div className="doctor_add_form_buttons">
              <button type="submit" className="doctor_add_button" disabled={editLoading}>
                {editLoading ? "Đang lưu..." : "Lưu"}
              </button>
              <button type="button" className="doctor_cancel_button" onClick={handleCancelEdit} disabled={editLoading}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="doctor_table">
        <div className="doctor_table_header">
          <div className="doctor_table_header_grid">
            <div>Consult ID</div>
            <div>Date</div>
            <div>Doctor</div>
            <div>Patient Name</div>
            <div>Order ID</div>
            <div>Diagnose List IDs</div>
            <div>Operation</div>
          </div>
        </div>
        <div className="doctor_table_body">
          {loading ? (
            <div className="doctor_no_results">Đang tải...</div>
          ) : currentRows.length > 0 ? (
            currentRows.map((row, idx) => (
              <div key={row.consult_id + '-' + row.fullName + '-' + idx} className="doctor_table_row">
                <div className="doctor_table_row_grid">
                  <div className="doctor_cell_id">{row.consult_id}</div>
                  <div className="doctor_cell_text">{row.date}</div>
                  <div className="doctor_cell_name">{row.doctor_name}</div>
                  <div className="doctor_cell_name">{row.fullName}</div>
                  <div className="doctor_cell_text">{row.order_id}</div>
                  <div className="doctor_cell_text">{row.diagnose_id_list}</div>
                  <div className="doctor_actions">
                    <button
                      onClick={() => handleEditPatient(row)}
                      className="action_button edit_button"
                      title="Edit Patient"
                    >
                      <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Fix
                    </button>
                    <button
                      onClick={() => handleDeletePatient(row)}
                      className="action_button delete_button"
                      title="Delete Patient"
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
              No suitable data found
            </div>
          )}
        </div>
      </div>
      <div className="doctor_summary">
        <div>
          Show {currentRows.length} / {filteredRows.length} records
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
