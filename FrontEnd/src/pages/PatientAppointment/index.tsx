import { useEffect, useState } from "react";
import axiosInstance from "../../api/Axios";
import { SearchIcon } from "../../assets/SVG/Svg";
import './style.css';

type DoctorType = { _id: string, fullName: string };
type PatientType = { _id: string, fullName: string };
type ConsultType = {
  _id: string;
  consult_id: string;
  date: string;
  doctor_id: string | DoctorType;
  patient_id: string | PatientType;
  patient_description: string;
  result: string;
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

const sortableFields = [
  { label: "Consult ID", value: "consult_id" },
  { label: "Date", value: "date" },
  { label: "Doctor", value: "doctor_name" },
  { label: "Patient", value: "patient_name" },
  { label: "Description", value: "patient_description" },
  { label: "Result", value: "result" },
];

export default function PatientAppointment() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("UNKNOWN");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState<keyof AppointmentType | ''>('');
  const [sortOrder, setSortOrder] = useState<'increase' | 'decrease'>('increase');

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

  useEffect(() => {
    // Fetch consults of this patient & resolve doctor/patient name
    async function fetchConsults() {
      if (userId === "UNKNOWN") return;
      setLoading(true);
      try {
        const consultsRes = await axiosInstance.get('/consult');
        const allConsults: ConsultType[] = consultsRes.data.filter((c: any) => {
          // c.patient_id can be object or string
          if (typeof c.patient_id === "object" && c.patient_id !== null) {
            return c.patient_id._id === userId;
          }
          return c.patient_id === userId;
        });

        // Collect all doctor ids/patient ids needed
        const doctorIdSet = new Set<string>();
        const patientIdSet = new Set<string>();
        allConsults.forEach(c => {
          if (typeof c.doctor_id === "string") doctorIdSet.add(c.doctor_id);
          else if (c.doctor_id && typeof c.doctor_id === "object") doctorIdSet.add(c.doctor_id._id);
          if (typeof c.patient_id === "string") patientIdSet.add(c.patient_id);
          else if (c.patient_id && typeof c.patient_id === "object") patientIdSet.add(c.patient_id._id);
        });

        // Fetch doctor/patient info in batch
        const [doctorsRes, patientsRes] = await Promise.all([
          axiosInstance.get('/doctor'),
          axiosInstance.get('/patient'),
        ]);
        const doctorMap = new Map<string, string>();
        doctorsRes.data.forEach((d: DoctorType) => doctorMap.set(d._id, d.fullName));
        const patientMap = new Map<string, string>();
        patientsRes.data.forEach((p: PatientType) => patientMap.set(p._id, p.fullName));

        // Build appointment array for table
        const appointments: AppointmentType[] = allConsults.map((c) => {
          let doctorId = typeof c.doctor_id === "string" ? c.doctor_id : c.doctor_id?._id;
          let doctorName = doctorMap.get(doctorId || '') || '';
          let patientId = typeof c.patient_id === "string" ? c.patient_id : c.patient_id?._id;
          let patientName = patientMap.get(patientId || '') || '';
          return {
            consult_id: c.consult_id || c._id,
            consult_db_id: c._id,
            date: c.date ? new Date(c.date).toLocaleDateString('en-CA') : '',
            doctor_id: doctorId || '',
            doctor_name: doctorName,
            patient_id: patientId || '',
            patient_name: patientName,
            patient_description: c.patient_description,
            result: c.result,
          };
        });

        setAppointments(appointments);
      } catch {
        setAppointments([]);
      }
      setLoading(false);
    }
    fetchConsults();
  }, [userId]);

  // Filter, sort, paginate
  const filtered = appointments.filter(item =>
    (item.consult_id && item.consult_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.date && item.date.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.doctor_name && item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.patient_name && item.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.patient_description && item.patient_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.result && item.result.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'increase' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRows = sorted.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, sortField, sortOrder]);

  const renderSortIcon = (field: keyof AppointmentType | '') => {
    if (sortField !== field) return <span className='init_sort_icon_admin'>▲</span>;
    return sortOrder === "increase" ? <span className='active_sort_icon_admin'>▼</span> : <span className='active_sort_icon_admin'>▲</span>;
  };

  const handleHeaderClick = (field: keyof AppointmentType | '') => {
    if (sortField === field) setSortOrder(sortOrder === "increase" ? "decrease" : "increase");
    else { setSortField(field); setSortOrder("increase"); }
  };

  return (
    <div className="background_diagnose_history">
      <div className="header_diagnose_history">Appointment History</div>
      {/* Search */}
      <div className="search_container_diagnose_history">
        <SearchIcon className="search_icon_diagnose_history" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search_input_diagnose_history"
        />
      </div>
      {/* Table */}
      <div className="table_diagnose_history">
        <div className="header_table_diagnose_history">
          {sortableFields.map(field => (
            <div
              key={field.value}
              onClick={() => handleHeaderClick(field.value as keyof AppointmentType)}
            >
              {field.label}
              {renderSortIcon(field.value as keyof AppointmentType)}
            </div>
          ))}
        </div>
        <div>
          {loading ? (
            <div className="diagnose_loader">Loading...</div>
          ) : currentRows.length === 0 ? (
            <div className="empty_diagnose_history">No Appointment found.</div>
          ) : (
            currentRows.map(d => (
              <div className="row_diagnose_history" key={d.consult_id}>
                <div title={d.consult_id}>{d.consult_id}</div>
                <div title={d.date}>{d.date}</div>
                <div title={d.doctor_name}>{d.doctor_name}</div>
                <div title={d.patient_name}>{d.patient_name}</div>
                <div title={d.patient_description}>{d.patient_description || '-'}</div>
                <div>{d.result ?? 'N/A'}</div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="diagnose_pagination">
        <div>
          Show {currentRows.length} / {sorted.length} appointments
        </div>
        {totalPages > 1 && (
          <div className="doctor_pagination">
            <button onClick={() => setCurrentPage(c => Math.max(1, c - 1))} disabled={currentPage === 1} className="pagination_button">
              Before
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`pagination_button ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))} disabled={currentPage === totalPages} className="pagination_button">
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