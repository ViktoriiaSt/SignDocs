import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { signPdf } from '../pdfService';

vi.mock('axios');

describe('pdfService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signPdf', () => {
    it('sends PDF file to server and returns blob', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const mockBlob = new Blob(['signed pdf'], { type: 'application/pdf' });

      vi.mocked(axios.post).mockResolvedValue({ data: mockBlob });

      const result = await signPdf(mockFile);

      expect(axios.post).toHaveBeenCalledWith(
        '/api/sign-pdf',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      expect(result).toBe(mockBlob);
    });

    it('includes the file in FormData', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const mockBlob = new Blob(['signed pdf'], { type: 'application/pdf' });

      let capturedFormData: FormData | null = null;

      vi.mocked(axios.post).mockImplementation((_url, data) => {
        capturedFormData = data as FormData;
        return Promise.resolve({ data: mockBlob });
      });

      await signPdf(mockFile);

      expect(capturedFormData).toBeInstanceOf(FormData);
      expect((capturedFormData as unknown as FormData).get('pdf')).toBe(mockFile);
    });

    it('throws error when API returns error', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      vi.mocked(axios.post).mockRejectedValue({
        isAxiosError: true,
        response: {
          data: { error: 'Invalid PDF file' },
        },
      });

      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      await expect(signPdf(mockFile)).rejects.toThrow('Invalid PDF file');
    });

    it('throws generic error when API fails without specific error', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      vi.mocked(axios.post).mockRejectedValue({
        isAxiosError: true,
        response: {},
      });

      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      await expect(signPdf(mockFile)).rejects.toThrow('Failed to sign PDF');
    });

    it('re-throws non-axios errors', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const customError = new Error('Network error');

      vi.mocked(axios.post).mockRejectedValue(customError);
      vi.mocked(axios.isAxiosError).mockReturnValue(false);

      await expect(signPdf(mockFile)).rejects.toThrow('Network error');
    });
  });
});
