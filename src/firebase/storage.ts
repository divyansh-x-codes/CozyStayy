import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import app from "./config";

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage with progress tracking
 * @param file - The File object to upload
 * @param path - The path/directory in storage (e.g., 'properties/images')
 * @param onProgress - Optional callback for upload progress
 * @returns Promise resolving to the download URL
 */
export const uploadImage = async (
  file: File, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  if (!file) throw new Error("No file provided");

  // Create a unique filename to avoid overwriting
  const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
  const storageRef = ref(storage, `${path}/${uniqueFilename}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Deletes a file from Firebase Storage given its URL
 * @param url - The download URL of the file to delete
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    // We need to parse the path from the URL
    // Firebase storage URLs look like: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?alt=media...
    const decodedUrl = decodeURIComponent(url);
    const pathStartIndex = decodedUrl.indexOf('/o/') + 3;
    const pathEndIndex = decodedUrl.indexOf('?alt=media');
    
    if (pathStartIndex > 2 && pathEndIndex > -1) {
      const path = decodedUrl.substring(pathStartIndex, pathEndIndex);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } else {
      throw new Error("Could not parse storage path from URL");
    }
  } catch (error) {
    console.error("Delete image error:", error);
    throw error;
  }
};
