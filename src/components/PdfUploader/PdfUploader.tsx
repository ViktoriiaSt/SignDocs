import { useState, useRef, ChangeEvent } from 'react';
import { Button, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { signPdf } from '../../services/pdfService';
import './PdfUploader.css';

interface PdfUploaderProps {
  onPdfSigned: (url: string, fileName: string) => void;
}

const PdfUploader = ({ onPdfSigned }: PdfUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const signedPdfBlob = await signPdf(selectedFile);
      const url = URL.createObjectURL(signedPdfBlob);
      onPdfSigned(url, `signed-${selectedFile.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign PDF');
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="pdf-uploader-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="application/pdf"
        className="hidden-file-input"
      />

      <div className="upload-area-wrapper">
        <div
          className={`upload-paper ${selectedFile ? 'file-selected' : ''}`}
          onClick={handleButtonClick}
        >
          {selectedFile ? (
            <div className="upload-content">
              <CheckCircleIcon className="upload-icon selected" />
              <h3 className="upload-title">{selectedFile.name}</h3>
              <p className="upload-subtitle">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="upload-content">
              <CloudUploadIcon className="upload-icon" />
              <h3 className="upload-title">Tap to select a PDF</h3>
              <p className="upload-subtitle">Maximum file size: 10MB</p>
            </div>
          )}
        </div>

        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}
      </div>

      {selectedFile && (
        <div className="button-wrapper">
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleUpload}
            disabled={uploading}
            startIcon={<CloudUploadIcon />}
            className="upload-button"
          >
            {uploading ? 'Signing PDF...' : 'Sign PDF'}
          </Button>
          {uploading && <LinearProgress className="progress-bar" />}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
