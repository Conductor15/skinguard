import '../doctors/Doctor.css';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/Axios';

type DoctorType = {
  _id: string;
  fullName: string;
  consult_list_id: string[];
};
type ConsultType = {
  _id: string;
  consult_id: string;
  date: string;
  patient_id: string | { _id: string };
  patient_description: string;
  result: string;
};
type PatientType = {
  _id: string;
  fullName: string;
};
type AppointmentType = {
  consult_id: string;
  consult_db_id: string;
  date: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  patient_name: string;
  patient_description: string;
  result: string;
};

export default function Appointment() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    consult_id: '',
    date: '',
    doctor_id: '',
    patient_id: '',
    patient_description: '',
    result: '',
  });
  const [editForm, setEditForm] = useState({
    consult_db_id: '',
    consult_id: '',
    date: '',
    doctor_id: '',
    patient_id: '',
    patient_description: '',
    result: '',
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch doctors and patients for select options
  useEffect(() => {
    async function fetchDoctorsAndPatients() {
      try {
        const [docRes, patRes] = await Promise.all([
          axiosInstance.get('/doctor'),
          axiosInstance.get('/patient')
        ]);
        setDoctors(docRes.data);
        setPatients(patRes.data);
      } catch (err) {
        setDoctors([]);
        setPatients([]);
      }
    }
    fetchDoctorsAndPatients();
  }, []);

  // Fetch all appointments
  const fetchAllAppointments = async () => {
    setLoading(true);
    try {
      const doctorRes = await axiosInstance.get('/doctor');
      const doctors: DoctorType[] = doctorRes.data;
      const tempAppointments: AppointmentType[] = [];

      await Promise.all(doctors.map(async (doctor) => {
        await Promise.all((doctor.consult_list_id || []).map(async (consultId) => {
          try {
            const consultRes = await axiosInstance.get(`/consult/${consultId}`);
            const consult: ConsultType = consultRes.data;

            let patientId = consult.patient_id;
            if (typeof patientId === 'object' && patientId !== null && '_id' in patientId) {
              patientId = (patientId as any)._id;
            }
            const patientRes = await axiosInstance.get(`/patient/${patientId}`);
            const patient: PatientType = patientRes.data;

            tempAppointments.push({
              consult_id: consult.consult_id || consult._id,
              consult_db_id: consult._id,
              date: consult.date ? new Date(consult.date).toLocaleDateString('en-CA') : '',
              doctor_id: doctor._id,
              doctor_name: doctor.fullName,
              patient_id: patient._id,
              patient_name: patient.fullName,
              patient_description: consult.patient_description,
              result: consult.result,
            });
          } catch {}
        }));
      }));

      tempAppointments.sort((a, b) => b.date.localeCompare(a.date));
      setAppointments(tempAppointments);
    } catch (err) {
      setAppointments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAppointments();
    // eslint-disable-next-line
  }, []);

  // Search filter
  const filteredAppointments = appointments.filter(item =>
    (item.consult_id && item.consult_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.date && item.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.doctor_name && item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.patient_name && item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.patient_description && item.patient_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.result && item.result.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // Add
  const handleAddAppointment = () => setShowAddForm(true);

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await axiosInstance.post('/consult', {
        consult_id: addForm.consult_id,
        date: addForm.date,
        patient_id: addForm.patient_id,
        patient_description: addForm.patient_description,
        result: addForm.result,
      });
      const newConsultId = res.data._id ?? res.data.consult_id;
      await axiosInstance.patch(`/doctor/${addForm.doctor_id}`, {
        $push: { consult_list_id: newConsultId }
      });
      setShowAddForm(false);
      setAddForm({
        consult_id: '',
        date: '',
        doctor_id: '',
        patient_id: '',
        patient_description: '',
        result: '',
      });
      await fetchAllAppointments();
    } catch {
      alert('Thêm cuộc hẹn thất bại!');
    }
    setAddLoading(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setAddForm({
      consult_id: '',
      date: '',
      doctor_id: '',
      patient_id: '',
      patient_description: '',
      result: '',
    });
  };

  // Edit
  const handleEditAppointment = (item: AppointmentType) => {
    setEditForm({
      consult_db_id: item.consult_db_id,
      consult_id: item.consult_id,
      date: item.date,
      doctor_id: item.doctor_id,
      patient_id: item.patient_id,
      patient_description: item.patient_description,
      result: item.result,
    });
    setShowEditForm(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await axiosInstance.patch(`/consult/${editForm.consult_db_id}`, {
        consult_id: editForm.consult_id,
        date: editForm.date,
        patient_id: editForm.patient_id,
        patient_description: editForm.patient_description,
        result: editForm.result,
      });
      setShowEditForm(false);
      await fetchAllAppointments();
    } catch {
      alert('Điều chỉnh thất bại!');
    }
    setEditLoading(false);
  };

  const handleCancelEdit = () => setShowEditForm(false);

  // Delete
  const handleDeleteAppointment = async (item: AppointmentType) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc hẹn này?')) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/consult/${item.consult_db_id}`);
      await axiosInstance.patch(`/doctor/${item.doctor_id}`, {
        $pull: { consult_list_id: item.consult_db_id }
      });
      await fetchAllAppointments();
    } catch {
      alert('Xóa thất bại!');
    }
    setLoading(false);
  };

  // Pagination
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="doctor_container">
      {/* Header */}
      <div className="doctor_header">
        <div className="doctor_title">List of appointments</div>
        <div className="doctor_controls">
          <div className="doctor_search_container">
            <svg className="doctor_search_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Find an appointment..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="doctor_search_input"
            />
          </div>
          <button
            onClick={handleAddAppointment}
            className="doctor_add_button"
          >
            Add new appointment
          </button>
        </div>
      </div>

      {/* Add Appointment Form */}
      {showAddForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleAddFormSubmit}>
            <h3>Thêm cuộc hẹn mới</h3>
            <input name="consult_id" placeholder="Consult ID" value={addForm.consult_id} onChange={handleAddFormChange} required />
            <input name="date" type="date" placeholder="Date" value={addForm.date} onChange={handleAddFormChange} required />
            <select name="doctor_id" value={addForm.doctor_id} onChange={handleAddFormChange} required>
              <option value="">Chọn bác sĩ</option>
              {doctors.map(d => <option value={d._id} key={d._id}>{d.fullName}</option>)}
            </select>
            <select name="patient_id" value={addForm.patient_id} onChange={handleAddFormChange} required>
              <option value="">Chọn bệnh nhân</option>
              {patients.map(p => <option value={p._id} key={p._id}>{p.fullName}</option>)}
            </select>
            <input name="patient_description" placeholder="Mô tả bệnh nhân" value={addForm.patient_description} onChange={handleAddFormChange} required />
            <input name="result" placeholder="Kết quả" value={addForm.result} onChange={handleAddFormChange} required />
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

      {/* Edit Appointment Form */}
      {showEditForm && (
        <div className="doctor_add_form_overlay">
          <form className="doctor_add_form" onSubmit={handleEditFormSubmit}>
            <h3>Điều chỉnh cuộc hẹn</h3>
            <input name="consult_id" placeholder="Consult ID" value={editForm.consult_id} onChange={handleEditFormChange} required />
            <input name="date" type="date" placeholder="Date" value={editForm.date} onChange={handleEditFormChange} required />
            <select name="doctor_id" value={editForm.doctor_id} onChange={handleEditFormChange} disabled>
              <option value="">Chọn bác sĩ</option>
              {doctors.map(d => <option value={d._id} key={d._id}>{d.fullName}</option>)}
            </select>
            <select name="patient_id" value={editForm.patient_id} onChange={handleEditFormChange} required>
              <option value="">Chọn bệnh nhân</option>
              {patients.map(p => <option value={p._id} key={p._id}>{p.fullName}</option>)}
            </select>
            <input name="patient_description" placeholder="Mô tả bệnh nhân" value={editForm.patient_description} onChange={handleEditFormChange} required />
            <input name="result" placeholder="Kết quả" value={editForm.result} onChange={handleEditFormChange} required />
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
        {/* Table Header */}
        <div className="doctor_table_header">
          <div className="doctor_table_header_grid">
            <div>ID</div>
            <div>Date</div>
            <div>Doctor</div>
            <div>Patient</div>
            <div>Description</div>
            <div>Result</div>
            <div>Operation</div>
          </div>
        </div>
        {/* Table Body */}
        <div className="doctor_table_body">
          {loading ? (
            <div className="doctor_no_results">Đang tải...</div>
          ) : currentAppointments.length ? (
            currentAppointments.map(item => (
              <div key={item.consult_id} className="doctor_table_row">
                <div className="doctor_table_row_grid">
                  <div className="doctor_cell_id">{item.consult_id}</div>
                  <div className="doctor_cell_text">{item.date}</div>
                  <div className="doctor_cell_name">{item.doctor_name}</div>
                  <div className="doctor_cell_name">{item.patient_name}</div>
                  <div className="doctor_cell_text">{item.patient_description}</div>
                  <div className="doctor_cell_text">{item.result}</div>
                  <div className="doctor_actions">
                    <button
                      onClick={() => handleEditAppointment(item)}
                      className="action_button edit_button"
                      title="Edit Appointment"
                    >
                      <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Fix
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(item)}
                      className="action_button delete_button"
                      title="Delete appointment"
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
              No suitable appointment found
            </div>
          )}
        </div>
      </div>

      {/* Summary and Pagination */}
      <div className="doctor_summary">
        <div>
          Show {currentAppointments.length} / {filteredAppointments.length} appointments
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