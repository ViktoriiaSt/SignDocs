import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PdfUploader from './PdfUploader';

describe('PdfUploader', () => {
  it('renders upload interface correctly', () => {
    const mockOnPdfSigned = vi.fn();
    render(<PdfUploader onPdfSigned={mockOnPdfSigned} />);

    expect(screen.getByText('Tap to select a PDF')).toBeInTheDocument();
    expect(screen.getByText('Maximum file size: 10MB')).toBeInTheDocument();
  });
});
