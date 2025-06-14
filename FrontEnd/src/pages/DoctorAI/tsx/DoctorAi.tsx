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