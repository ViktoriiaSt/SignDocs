import axios from 'axios';

const API_BASE_URL = '/api';

export const signPdf = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/sign-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to sign PDF');
    }
    throw error;
  }
};
