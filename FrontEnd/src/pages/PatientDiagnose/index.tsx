import { useEffect, useState } from "react";
import axiosInstance from "../../api/Axios";
import './style.css'

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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="background_diagnose_history">
            <div className="header_diagnose_history">Diagnose History</div>
            <div className="table_diagnose_history">
                <div className="row_diagnose_history">
                    <div>Diagnose ID</div>
                    <div>Confidece</div>
                    <div>Description</div>
                    <div>Image</div>
                    <div>Image</div>
                    <div>Created At</div>
                </div>
                <div className="">
                    {diagnoses.length === 0 ? (
                        <div>No diagnoses found.</div>
                    ) : (
                        diagnoses.map((d) => (
                            <div className="row_diagnose_history">
                                <div>{d.diagnose_id}</div>
                                <div>{d.confidence}</div>
                                <div>{d.description}</div>
                                <img src={d.image} alt="diagnose" style={{ maxWidth: 60, maxHeight: 60, objectFit: 'cover' }} />
                                <div>{d.prediction}</div>
                                <div>{d.createdAt}</div>
                            </div>
                        ))
                    )}
                </div>
            </div> 
        </div>
    );
}

export default PatientDiagnose;