import React, { useState } from "react";
import "../css/DoctorAI.css";

const DoctorAI: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResult(null);
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
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error("Lỗi server AI: " + err);
      }

      const data = await res.json();
      if (data.prediction) {
        setResult(data.prediction);

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        if (!storedUser || !token) {
          console.warn('Không có thông tin người dùng hoặc token');
          return;
        }


        const user = JSON.parse(storedUser);
        const userId = user.id || user.patient_id;

        const diagnoseData = {
          diagnose_id: "DGN" + Math.floor(100000 + Math.random() * 900000), // random ID tạm thời
          prediction: data.prediction,
          image: "https://hoseiki.vn/wp-content/uploads/2025/03/meo-cute-8.jpg", // bạn có thể dùng URL ảnh preview hiện tại, hoặc ảnh upload URL từ server AI
          description: "Normal", // có thể thay bằng phân tích thật
          confidence: data.confidence || 70.0,
          createdBy: userId,
        };

        try {
          const res = await fetch('http://localhost:8000/diagnose', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(diagnoseData),
          });

          if (!res.ok) {
            console.error('Lưu kết quả chẩn đoán thất bại');
          }
        } catch (e) {
          console.error('Lỗi khi gửi chẩn đoán đến server:', e);
        }
      } else {
        setError("Không nhận được kết quả hợp lệ từ AI.");
      }
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctorai-container">
      <h1 className="doctorai-title">Bác sĩ AI <span className="doctorai-emoji">🩺</span></h1>
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
      {error && (
        <div className="doctorai-error">
          {error}
        </div>
      )}
      {result && (
        <div className="doctorai-result-box">
          <h3>Kết quả AI:</h3>
          <div className="doctorai-result">{result}</div>
          <div className="doctorai-tip">
            (Phân loại: bkl, nv, df, mel, vasc, bcc, akiec)
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAI;