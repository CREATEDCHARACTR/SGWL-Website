import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage and returns the public download URL.
 * @param file The file to upload.
 * @param path The path in storage (default: 'delivery-images').
 * @returns Promise<string> The download URL.
 */
export const uploadDeliveryImage = async (file: File, path: string = 'delivery-images'): Promise<string> => {
    try {
        // Create a unique filename to prevent overwrites
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `${path}/${uniqueFilename}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload image.");
    }
};
