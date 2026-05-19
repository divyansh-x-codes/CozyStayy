import { useState } from "react";
import { uploadImage as uploadToFirebase } from "../firebase/storage";
import { toast } from "sonner";

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const upload = async (file: File, path: string) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);
    setUrl(null);

    try {
      // Basic validation
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image must be less than 5MB');
      }

      const downloadUrl = await uploadToFirebase(file, path, (p) => {
        setProgress(Math.round(p));
      });
      
      setUrl(downloadUrl);
      toast.success("Image uploaded successfully");
      return downloadUrl;
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err);
      toast.error(err.message || "Failed to upload image");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUrl(null);
  };

  return { upload, isUploading, progress, error, url, reset };
};
