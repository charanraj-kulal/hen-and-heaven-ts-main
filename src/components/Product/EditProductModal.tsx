import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  stock: number;
  actualPrice: number;
  discountType: "amount" | "percentage" | null;
  discountedPrice: number | null;
  finalPrice: number;
  status: "active" | "inactive";
  productType: string;
  productSubType: string; // Add productSubType field
}

interface EditProductModalProps {
  item: ProductItem;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedItem: ProductItem) => Promise<void>;
}

const EditInventoryModal: React.FC<EditProductModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedItem, setEditedItem] = useState<ProductItem>(item);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(
    item.discountedPrice !== null
  );

  const subTypeOptions: { [key: string]: string[] } = {
    eggs: [
      "Standard White Eggs",
      "Standard Brown Eggs",
      "Furnished / Enriched / Nest-Laid Eggs",
      "Vitamin-Enhanced Eggs",
      "Vegetarian Eggs",
      "Processed Eggs",
    ],
    chickens: [
      "Boiler Chicken",
      "Tyson Chicken",
      "Delaware Chicken",
      "Jersey Giant Chicken",
      "Desi Chicken",
      "Breast Pieces",
      "Tenderloins Pieces",
      "Thighs",
      "Drumsticks",
      "Wings",
      "Neck",
      "Back",
    ],
    "hens-and-chicks": [
      "Boiler Chicken",
      "Tyson Chicken",
      "Delaware Chicken",
      "Jersey Giant Chicken",
      "Desi Chicken",
      "Colored Chicks",
    ],
    "bulk-eggs-chickens-feeds": [
      "30-300 Crate Eggs",
      "30-500kg Chicken Meats",
      "30-1000 Chicks",
      "30-500 Chickens",
      "30-200 Feed Bags",
      "30kg-100kg Feed Bags",
    ],
  };

  useEffect(() => {
    if (editedItem.productType) {
      fetchAvailableImages();
    }
  }, [editedItem.productType]);

  useEffect(() => {
    calculateFinalPrice(editedItem);
  }, [
    editedItem.actualPrice,
    editedItem.discountType,
    editedItem.discountedPrice,
  ]);

  const fetchAvailableImages = async () => {
    const folderMap: { [key: string]: string } = {
      eggs: "eggs/",
      chickens: "chickens/",
      "hens-and-chicks": "hen-and-chicks/",
      "bulk-eggs-chickens-feeds": "bulk-eggs-chickens-feeds/",
    };

    const selectedFolder = folderMap[editedItem.productType];
    if (!selectedFolder) return;

    try {
      const listRef = ref(storage, `products/${selectedFolder}`);
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

    if (name === "productType") {
      setEditedItem((prev) => ({ ...prev, imageUrl: "", productSubType: "" }));
    }
  };

  const handleImageSelect = (url: string) => {
    setEditedItem((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleDiscountToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsDiscountApplied(isChecked);
    setEditedItem((prev) => ({
      ...prev,
      discountType: isChecked ? "percentage" : null,
      discountedPrice: isChecked ? 0 : null,
    }));
  };

  const calculateFinalPrice = (data: ProductItem) => {
    const actualPrice = parseFloat(data.actualPrice.toString());
    if (!isDiscountApplied || isNaN(actualPrice)) {
      setEditedItem((prev) => ({ ...prev, finalPrice: actualPrice }));
      return;
    }
    const discountValue = parseFloat(data.discountedPrice?.toString() || "0");
    if (isNaN(discountValue)) return;

    let finalPrice: number;
    if (data.discountType === "percentage") {
      finalPrice = actualPrice - (actualPrice * discountValue) / 100;
    } else if (data.discountType === "amount") {
      finalPrice = actualPrice - discountValue;
    } else {
      finalPrice = actualPrice;
    }
    setEditedItem((prev) => ({ ...prev, finalPrice }));
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
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative mt-20 bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full shadow-lg transition-all transform duration-300 ease-in-out">
        <div className="max-h-150 overflow-y-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Edit Product Item
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
                  htmlFor="productType"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  Product Type
                </label>
                <select
                  id="productType"
                  name="productType"
                  value={editedItem.productType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required
                >
                  <option
                    className=" text-black dark:text-white dark:bg-black bg-white"
                    value=""
                  >
                    Select Product Type
                  </option>
                  <option
                    className=" text-black dark:text-white dark:bg-black bg-white"
                    value="eggs"
                  >
                    Eggs
                  </option>
                  <option
                    className=" text-black dark:text-white dark:bg-black bg-white"
                    value="chickens"
                  >
                    Chickens
                  </option>
                  <option
                    className=" text-black dark:text-white dark:bg-black bg-white"
                    value="hens-and-chicks"
                  >
                    Hens and Chicks
                  </option>
                  <option
                    className=" text-black dark:text-white dark:bg-black bg-white"
                    value="bulk-eggs-chickens-feeds"
                  >
                    Bulk Eggs, Chickens, Feeds
                  </option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300">
                Product Image
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {availableImages.map((url, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer aspect-square ${
                      editedItem.imageUrl === url ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleImageSelect(url)}
                  >
                    <img
                      src={url}
                      alt={`Product ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Sub Product Dropdown */}
            <div className="w-full mb-2">
              <label
                htmlFor="productSubType"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Product Sub-Type
              </label>
              <select
                id="productSubType"
                name="productSubType"
                value={editedItem.productSubType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                required
              >
                <option value="">Select Sub-Type</option>
                {subTypeOptions[editedItem.productType]?.map((subType) => (
                  <option key={subType} value={subType}>
                    {subType}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label
                  htmlFor="stock"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={editedItem.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="actualPrice"
                  className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                  Actual Price
                </label>
                <input
                  type="number"
                  id="actualPrice"
                  name="actualPrice"
                  value={editedItem.actualPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  required
                />
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDiscountApplied}
                  onChange={handleDiscountToggle}
                  className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Apply Discount
                </span>
              </label>
            </div>

            {isDiscountApplied && (
              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <label
                    htmlFor="discountType"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={editedItem.discountType || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="amount">Amount</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="discountedPrice"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Discounted{" "}
                    {editedItem.discountType === "percentage"
                      ? "Percentage"
                      : "Amount"}
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    name="discountedPrice"
                    value={editedItem.discountedPrice || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="finalPrice"
                className="block mb-2 text-gray-700 dark:text-gray-300"
              >
                Final Price
              </label>
              <input
                type="number"
                id="finalPrice"
                name="finalPrice"
                value={editedItem.finalPrice}
                readOnly
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 bg-gray-100 "
              />
            </div>

            <div className="mb-4">
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

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 ${
                  isUpdating ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal;
