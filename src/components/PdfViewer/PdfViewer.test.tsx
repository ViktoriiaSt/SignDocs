import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PdfViewer from './PdfViewer';

describe('PdfViewer', () => {
  const mockOnReset = vi.fn();
  const mockPdfUrl = 'blob:http://localhost:3000/test-pdf';
  const mockFileName = 'signed-test.pdf';

  it('renders successfully with PDF', () => {
    render(
      <PdfViewer
        pdfUrl={mockPdfUrl}
        fileName={mockFileName}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('PDF Signed Successfully!')).toBeInTheDocument();
    expect(screen.getByText(mockFileName)).toBeInTheDocument();
  });

  it('displays PDF in iframe', () => {
    render(
      <PdfViewer
        pdfUrl={mockPdfUrl}
        fileName={mockFileName}
        onReset={mockOnReset}
      />
    );

    const iframe = screen.getByTitle('Signed PDF') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toBe(`${mockPdfUrl}#view=FitH`);
  });

  it('shows download and reset buttons', () => {
    render(
      <PdfViewer
        pdfUrl={mockPdfUrl}
        fileName={mockFileName}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('Download Signed PDF')).toBeInTheDocument();
    expect(screen.getByText('Sign Another PDF')).toBeInTheDocument();
  });

  it('calls onReset when Sign Another PDF button is clicked', async () => {
    render(
      <PdfViewer
        pdfUrl={mockPdfUrl}
        fileName={mockFileName}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByText('Sign Another PDF');
    await userEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('triggers download when Download button is clicked', async () => {
    render(
      <PdfViewer
        pdfUrl={mockPdfUrl}
        fileName={mockFileName}
        onReset={mockOnReset}
      />
    );

    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    const originalCreateElement = document.createElement;
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    createElementSpy.mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement.call(document, tagName);
    });

    appendChildSpy.mockImplementation(() => mockLink as any);
    removeChildSpy.mockImplementation(() => mockLink as any);

    const downloadButton = screen.getByText('Download Signed PDF');
    await userEvent.click(downloadButton);

    expect(mockLink.href).toBe(mockPdfUrl);
    expect(mockLink.download).toBe(mockFileName);
    expect(mockLink.click).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
