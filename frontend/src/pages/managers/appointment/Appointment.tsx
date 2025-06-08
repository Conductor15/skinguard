import './Appointment.css';
import { useState, useEffect } from 'react';

const Appointment = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const appointmentsData = [
        {
            ID: "1",
            Date: "2023-01-01",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Cancelled"
        },
        {
            ID: "2", 
            Date: "2123-02-15",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Pending"
        },
        {
            ID: "3",
            Date: "2023-03-10",
            Time: "09:00AM", 
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Confirmed"
        },
        {
            ID: "4",
            Date: "2023-03-10",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A", 
            Patient: "Nguyễn Văn B",
            Status: "Completed"
        },
        {
            ID: "5",
            Date: "2023-03-10",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Cancelled"
        },
        {
            ID: "6",
            Date: "2023-03-10",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Cancelled"
        },
        {
            ID: "7",
            Date: "2023-03-10",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Cancelled"
        },
        {
            ID: "8",
            Date: "2023-03-10",
            Time: "09:00AM",
            Doctor: "Nguyễn Văn A",
            Patient: "Nguyễn Văn B",
            Status: "Cancelled"
        }
    ];

    // Filter doctors based on search term
    const filteredDoctors = appointmentsData.filter(doctor =>
        doctor.ID.includes(searchTerm) ||
        doctor.Date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.Time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.Doctor.includes(searchTerm.toLowerCase()) ||
        doctor.Patient.includes(searchTerm.toLowerCase()) ||
        doctor.Status.includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

    const handleAddDoctor = () => {
        alert('Chức năng thêm bác sĩ mới');
    };

    const handleEditDoctor = (doctorId: string) => {
        alert(`Chỉnh sửa hồ sơ bác sĩ ID: ${doctorId}`);
    };

    const handleDeleteDoctor = (doctorId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            alert(`Xóa bác sĩ ID: ${doctorId}`);
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

    // Reset current page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="doctor_container">
            {/* Header */}
            <div className="doctor_header">
                <div className="doctor_title"> List of Appointment</div>
                
                {/* Search and Add Button */}
                <div className="doctor_controls">
                    <div className="doctor_search_container">
                        <svg className="doctor_search_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Find an appointment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="doctor_search_input"
                        />
                    </div>
                    
                    <button
                        onClick={handleAddDoctor}
                        className="doctor_add_button"
                    >
                        Add new appointment
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="doctor_table">
                {/* Table Header */}
                <div className="doctor_table_header">
                    <div className="doctor_table_header_grid">
                        <div>ID</div>
                        <div>Date</div>
                        <div className="doctor_cell_Time">Time</div>
                        <div className="doctor_cell_experience">Doctor</div>
                        <div>Patient</div>
                        <div className="doctor_cell_phone">Status</div>
                        <div>Operation</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="doctor_table_body">
                    {currentDoctors.length > 0 ? (
                        currentDoctors.map((doctor) => (
                            <div key={doctor.ID} className="doctor_table_row">
                                <div className="doctor_table_row_grid">
                                    <div className="doctor_cell_id">
                                        {doctor.ID}
                                    </div>
                                    <div className="doctor_cell_name">
                                        {doctor.Date}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_Time">
                                        {doctor.Time}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_experience">
                                        {doctor.Doctor}
                                    </div>
                                    <div className="doctor_rating">
                                        {doctor.Patient}
                                    </div>
                                    <div className="doctor_cell_text doctor_cell_phone">
                                        {doctor.Status}
                                    </div>
                                    <div className="doctor_actions">
                                        <button
                                            onClick={() => handleEditDoctor(doctor.ID)}
                                            className="action_button edit_button"
                                            title="Edit Profile"
                                        >
                                            <svg className="action_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Fix
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoctor(doctor.ID)}
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

export default Appointment;