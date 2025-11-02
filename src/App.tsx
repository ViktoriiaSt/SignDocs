import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PdfUploader from './components/PdfUploader';
import PdfViewer from './components/PdfViewer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handlePdfSigned = (url: string, name: string) => {
    setSignedPdfUrl(url);
    setFileName(name);
  };

  const handleReset = () => {
    if (signedPdfUrl) {
      URL.revokeObjectURL(signedPdfUrl);
    }
    setSignedPdfUrl(null);
    setFileName('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <AppBar position="static" elevation={0} sx={{ borderRadius: 0 }}>
          <Toolbar>
            <DescriptionIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              PDF Signer
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="md"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            py: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 3 }
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 4 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {!signedPdfUrl ? (
              <>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                >
                  Upload & Sign Your PDF
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 3 }}
                >
                  Upload a PDF document to get it digitally signed. The document will be
                  processed securely and returned with a digital signature.
                </Typography>
                <PdfUploader onPdfSigned={handlePdfSigned} />
              </>
            ) : (
              <PdfViewer pdfUrl={signedPdfUrl} fileName={fileName} onReset={handleReset} />
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
