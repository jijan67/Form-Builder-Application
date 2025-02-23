import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface CloudImageUploadProps {
  onUpload: (url: string) => void;
}

const CloudImageUpload = ({ onUpload }: CloudImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      // Create a FormData instance
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Cloudinary or similar service
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <label htmlFor="image-upload">
        <Button
          component="span"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploading}
        >
          Upload Image
        </Button>
      </label>
    </Box>
  );
};

export default CloudImageUpload; 