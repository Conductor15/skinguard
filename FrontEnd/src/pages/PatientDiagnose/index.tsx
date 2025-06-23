import { useEffect, useState } from "react";
import axiosInstance from "../../api/Axios";
import './style.css';
import { DiagnoseType } from "../../types/Types";

const PatientDiagnose = () => {
    const [diagnoses, setDiagnoses] = useState<DiagnoseType[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>("UNKNOWN");

    // Fetch patient
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

    // Fetch all diagnoses
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

    if (loading) return <div className="diagnose_loader">Loading...</div>;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return (
        <div className="background_diagnose_history">
            <div className="header_diagnose_history">Diagnose History</div>
            <div className="table_diagnose_history">
                <div className="header_table_diagnose_history">
                    <div>Diagnose ID</div>
                    <div>Confidence</div>
                    <div>Description</div>
                    <div>Prediction</div>
                    <div>Image</div>
                    <div>Created At</div>
                </div>
                <div>
                    {diagnoses.length === 0 ? (
                        <div className="empty_diagnose_history">No diagnoses found.</div>
                    ) : (
                        diagnoses.map((d) => (
                            <div className="row_diagnose_history" key={d._id}>
                                <div title={d.diagnose_id}>{d.diagnose_id}</div>
                                <div>{d.confidence !== undefined ? `${(d.confidence * 100).toFixed(1)}%` : 'N/A'}</div>
                                <div title={d.description}>{d.description || '-'}</div>
                                <div title={d.prediction}>{d.prediction}</div>
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
                                <div>{formatDate(d.createdAt)}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDiagnose;