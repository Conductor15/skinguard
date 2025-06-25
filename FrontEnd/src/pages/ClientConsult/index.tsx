import "./style.css";
import { DoctorType } from "../../types/Types";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/Axios";

type ConsultType = {
    consult_id: string;
    date: string;
    doctor_id: string;
    patient_id: string;
    patient_description: string;
    result: string;
};

function generateNextConsultID(consults: ConsultType[]): string {
    const prefix = "CST";
    const usedNumbers = consults
        .map(app => app.consult_id)
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

const initialFormState = (userId: string): ConsultType => ({
    consult_id: "",
    date: "",
    doctor_id: "",
    patient_id: userId,
    patient_description: "",
    result: "Normal",
});

const ClientConsult = () => {
    const [userId, setUserId] = useState<string>("UNKNOWN");
    const [doctors, setDoctors] = useState<DoctorType[]>([]);
    const [consults, setConsults] = useState<ConsultType[]>([]);
    const [addForm, setAddForm] = useState<ConsultType>(initialFormState("UNKNOWN"));

    // Fetch patient
    useEffect(() => {
        const storeUsers = localStorage.getItem("user");
        if (storeUsers) {
            try {
                const user = JSON.parse(storeUsers);
                setUserId(user.id);
            } catch {
                setUserId("UNKNOWN");
            }
        }
    }, []);

    // Sync patient_id to form when userId changes
    useEffect(() => {
        setAddForm((prev) => ({
            ...prev,
            patient_id: userId,
        }));
    }, [userId]);

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get('/doctor');
                setDoctors(response.data);
            } catch (error) {
                setDoctors([]);
            }
        };
        fetchDoctors();
    }, []);

    // Fetch existing consults to generate next consult_id
    useEffect(() => {
        const fetchConsults = async () => {
            try {
                const response = await axiosInstance.get('/consult');
                setConsults(response.data);
            } catch (error) {
                setConsults([]);
            }
        };
        fetchConsults();
    }, []);

    const handleAddFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setAddForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sinh consult_id mới
        const consult_id = generateNextConsultID(consults);

        // Chuyển date thành ISO 8601 string
        let isoDate = "";
        if (addForm.date) {
            isoDate = new Date(addForm.date).toISOString();
        }

        const finalForm: ConsultType = {
            ...addForm,
            consult_id,
            date: isoDate,
        };

        // Log để debug
        console.log("finalForm:", finalForm);

        try {
            await axiosInstance.post('/consult', finalForm);
            setAddForm(initialFormState(userId));
            alert('Add appointment success!');
            // Sau khi thêm thì load lại consults để id tiếp theo không bị trùng
            const response = await axiosInstance.get('/consult');
            setConsults(response.data);
        } catch (err: any) {
            alert('Add appointment failed!');
            console.log(err?.response?.data);
        }
    };

    return (
        <div className="consult-background">
            <div className="consult-container">
                <div className="consult-title">Appointment</div>
                <form className="consult-form" onSubmit={handleAddFormSubmit}>

                    <input
                        type="date"
                        name="date"
                        value={addForm.date}
                        onChange={handleAddFormChange}
                        required
                    />

                    <select
                        name="doctor_id"
                        value={addForm.doctor_id}
                        onChange={handleAddFormChange}
                        required
                    >
                        <option value="">Chọn bác sĩ</option>
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.fullName}
                            </option>
                        ))}
                    </select>

                    <textarea
                        name="patient_description"
                        placeholder="Note"
                        value={addForm.patient_description}
                        onChange={handleAddFormChange}
                        required
                    />

                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default ClientConsult;