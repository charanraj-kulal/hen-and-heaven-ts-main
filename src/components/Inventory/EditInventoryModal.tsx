import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  cost: number;
  status: "active" | "inactive";
  imageUrl: string;
}

interface EditInventoryModalProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: InventoryItem) => Promise<void>; // Expecting a Promise here
}

const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedItem, setEditedItem] = useState<InventoryItem>(item);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchAvailableImages();
  }, []);

  const fetchAvailableImages = async () => {
    try {
      const listRef = ref(storage, "inventory");
      const result = await listAll(listRef);
      const urlPromises = result.items.map((imageRef) =>
        getDownloadURL(imageRef)
      );
      const urls = await Promise.all(urlPromises);
      setAvailableImages(urls);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (url: string) => {
    setEditedItem((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await onUpdate(editedItem);
    setIsUpdating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Blurred background */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl max-h-180 mt-2 w-full shadow-lg transition-all transform duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Edit Inventory Item
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="name"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedItem.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="quantity"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={editedItem.quantity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="cost"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Cost
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={editedItem.cost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="status"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={editedItem.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={editedItem.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows={3}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-4">
              {availableImages.map((url, index) => (
                <div
                  key={index}
                  className={`cursor-pointer ${
                    editedItem.imageUrl === url
                      ? "border-4 border-blue-500"
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => handleImageSelect(url)}
                >
                  <img
                    src={url}
                    alt={`Inventory ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary border border-black bg-red-500 dark:border-white/30 hover:bg-red-900 hover:text-white transition-all p-2 rounded-md flex items-center mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary border bg-green-500 border-black dark:border-white/30 hover:bg-green-900 hover:text-white transition-all p-2 rounded-md flex items-center gap-1"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInventoryModal;
