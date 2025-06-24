import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../../api/Axios";
import '../css/DoctorAI.css';

const DoctorAI: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("UNKNOWN");

  // Get user info
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

  // Generate diagnose_id
  async function getNextDiagnoseId(): Promise<string> {
    const prefix = "DGN";
    try {
      const res = await axiosInstance.get("/diagnose");
      const diagnoses = res.data || [];
      const usedNumbers = diagnoses
        .map((d: any) => d.diagnose_id)
        .filter((id: string) => id && id.startsWith(prefix))
        .map((id: string) => parseInt(id.replace(prefix, ""), 10))
        .filter((n: number) => !isNaN(n))
        .sort((a: number, b: number) => a - b);

      let nextNum = 1;
      for (let num of usedNumbers) {
        if (num === nextNum) nextNum++;
        else break;
      }
      return prefix + nextNum.toString().padStart(2, "0");
    } catch {
      return prefix + "00001";
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResult(null);
      setConfidence(null);
      setError(null);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Vui lòng chọn một ảnh.");
      return;
    }
    setLoading(true);
    setResult(null);
    setConfidence(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const uploadRes = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.url;

      const aiForm = new FormData();
      aiForm.append("file", selectedFile);
      const aiRes = await axios.post("http://localhost:5000/predict", aiForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = aiRes.data;

      if (data.prediction) {
        setResult(data.prediction);
        setConfidence(data.confidence);

        const diagnose_id = await getNextDiagnoseId();

        const diagnoseData = {
          diagnose_id,
          prediction: data.prediction,
          image: imageUrl,
          description: "Normal",
          confidence: Number(data.confidence) || 70.0,
          createdBy: userId,
        };
        await axiosInstance.post('/diagnose', diagnoseData);

      } else {
        setError("Không nhận được kết quả hợp lệ từ AI.");
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError("Lưu kết quả thất bại: " + err.response.data.message);
      } else {
        setError(err.message || "Đã có lỗi xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctorai-container">
      <h1 className="doctorai-title">
        Bác sĩ AI <span className="doctorai-emoji">🩺</span>
      </h1>
      <form onSubmit={handleSubmit} className="doctorai-form">
        <label className="doctorai-upload-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="doctorai-file-input"
          />
          <span className="doctorai-upload-button">Chọn ảnh</span>
        </label>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="doctorai-preview-img"
          />
        )}
        <button
          type="submit"
          disabled={!selectedFile || loading}
          className="doctorai-submit-button"
        >
          {loading ? (
            <span className="doctorai-spinner"></span>
          ) : (
            "Chẩn đoán"
          )}
        </button>
      </form>
      {error && <div className="doctorai-error">{error}</div>}
      {result && (
        <div className="doctorai-result-box">
          <h3>Kết quả AI:</h3>
          <div className="doctorai-result">
            Dự đoán: <b>{result}</b>
          </div>
          {confidence !== null && (
            <div className="doctorai-result">
              Độ tin cậy: <b>{confidence}%</b>
            </div>
          )}
          <div className="doctorai-tip">
            (Phân loại: bkl, nv, df, mel, vasc, bcc, akiec)
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAI;