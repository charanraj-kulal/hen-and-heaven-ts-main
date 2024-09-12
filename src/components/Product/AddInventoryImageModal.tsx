import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

interface AddInventoryImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesAdded: () => void;
}

const AddInventoryImageModal: React.FC<AddInventoryImageModalProps> = ({
  isOpen,
  onClose,
  onImagesAdded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const storageRef = ref(storage, `inventory/${selectedFile.name}`);

    try {
      await uploadBytes(storageRef, selectedFile);
      await getDownloadURL(storageRef);
      onImagesAdded();
      onClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        {/* Blurred background */}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Add Inventory Image
          </h2>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectedFile.name}
            </p>
          )}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddInventoryImageModal;
