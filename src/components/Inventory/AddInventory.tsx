import React, { useState, useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useUser } from "../../hooks/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const InventoryAdd: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    cost: "",
    quantity: "",
  });
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const { userData } = useUser();
  const navigate = useNavigate();

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
      toast.error("Failed to load inventory images. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (url: string) => {
    setSelectedImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fetch the current financial data
      const henAndHeavenDoc = doc(db, "hen-and-heaven", "gNfmJEedFjmg8g6I7vMO");
      const docSnap = await getDoc(henAndHeavenDoc);
      if (docSnap.exists()) {
        const {
          capital,
          expense,
          netProfit,
          totalInventoryCost,
          totalRevenue,
        } = docSnap.data();

        const cost = parseFloat(formData.cost);
        const quantity = parseInt(formData.quantity);
        const totalCost = cost * quantity;

        if (totalCost > totalRevenue) {
          toast.error("Insufficient revenue to add inventory.");
          setIsLoading(false);
          return;
        }

        // Add inventory item
        await addDoc(collection(db, "inventory"), {
          ...formData,
          imageUrl: selectedImageUrl,
          addedBy: userData?.uid,
          addedAt: serverTimestamp(),
        });

        // Update financial data
        await updateDoc(henAndHeavenDoc, {
          totalRevenue: totalRevenue - totalCost,
          expense: expense + totalCost,
          totalInventoryCost: totalInventoryCost + totalCost,
          netProfit: netProfit - totalCost,
        });

        toast.success("Inventory added successfully!");

        // Reset form
        setFormData({
          name: "",
          description: "",
          status: "active",
          cost: "",
          quantity: "",
        });
        setSelectedImageUrl(null);
      } else {
        toast.error("Error fetching financial data.");
      }
    } catch (error) {
      console.error("Error adding inventory:", error);
      toast.error("Error adding inventory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Inventory" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <form onSubmit={handleSubmit} className="w-full p-6">
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Inventory Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Inventory Image
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-4">
                {availableImages.map((url, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-md aspect-square ${
                      selectedImageUrl === url ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => handleImageSelect(url)}
                  >
                    <img
                      src={url}
                      alt={`Inventory ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
              {selectedImageUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Selected Image:</p>
                  <img
                    src={selectedImageUrl}
                    alt="Selected"
                    className="w-48 h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="cost" className="mb-2 block text-sm font-medium">
                Cost
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="mb-2 block text-sm font-medium"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Inventory"
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DefaultLayout>
  );
};

export default InventoryAdd;
