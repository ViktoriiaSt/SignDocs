import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './PdfViewer.css';

interface PdfViewerProps {
  pdfUrl: string;
  fileName: string;
  onReset: () => void;
}

const PdfViewer = ({ pdfUrl, fileName, onReset }: PdfViewerProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-viewer-container">
      <div className="success-header">
        <CheckCircleOutlineIcon className="success-icon" />
        <h2 className="success-title">PDF Signed Successfully!</h2>
        <p className="file-name">{fileName}</p>
      </div>

      <div className="pdf-frame-container">
        <iframe
          src={`${pdfUrl}#view=FitH`}
          className="pdf-frame"
          title="Signed PDF"
        />
      </div>

      <div className="button-container">
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          className="download-button"
        >
          Download Signed PDF
        </Button>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          className="reset-button"
        >
          Sign Another PDF
        </Button>
      </div>
    </div>
  );
};

export default PdfViewer;
