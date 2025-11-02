import express, { Request, Response } from 'express';
import multer from 'multer';
import cors from 'cors';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

app.post('/api/sign-pdf', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    console.log('Received PDF for signing:', req.file.originalname);

    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const signatureText = 'DIGITALLY SIGNED';
    const timestamp = new Date().toLocaleString();
    const fontSize = 12;

    firstPage.drawRectangle({
      x: 50,
      y: 50,
      width: 200,
      height: 60,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });

    firstPage.drawText(signatureText, {
      x: 60,
      y: 85,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0.8),
    });

    firstPage.drawText(timestamp, {
      x: 60,
      y: 65,
      size: 10,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    const signedPdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="signed-${req.file.originalname}"`);
    res.send(Buffer.from(signedPdfBytes));
    console.log('PDF signed successfully');
  } catch (error) {
    console.error('Error signing PDF:', error);
    res.status(500).json({ error: 'Failed to sign PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Mock signing server running on http://localhost:${PORT}`);
});
