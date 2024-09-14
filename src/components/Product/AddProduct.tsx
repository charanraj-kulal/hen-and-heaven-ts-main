import React, { useState, useEffect } from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DefaultLayout from "../Layouts/DefaultLayout";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "../../hooks/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";

const ProductAddForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    stock: "",
    actualPrice: "",
    discountedPrice: "",
    discountType: "",
    finalPrice: "",
    productType: "",
    subType: "",
  });
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [discounted, setDiscounted] = useState(false);
  const { userData } = useUser();
  const navigate = useNavigate();

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
    if (formData.productType) fetchAvailableImages();
  }, [formData.productType]);

  const fetchAvailableImages = async () => {
    const folderMap: { [key: string]: string } = {
      eggs: "eggs/",
      chickens: "chickens/",
      "hens-and-chicks": "hen-and-chicks/",
      "bulk-eggs-chickens-feeds": "bulk-eggs-chickens-feeds/",
    };

    const selectedFolder = folderMap[formData.productType];
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
      toast.error("Failed to load product images. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "actualPrice" || name === "discountedPrice") {
      calculateFinalPrice({ ...formData, [name]: value });
    }
  };

  const handleImageSelect = (url: string) => {
    const imageName = url
      .split("/")
      .pop()
      ?.replace(/\.[^/.]+$/, "")
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/%2F/g, " ")
      .split(" ")
      .slice(1)
      .join(" ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    setFormData((prev) => ({ ...prev, name: imageName || "" }));
    setSelectedImageUrl(url);
  };

  const calculateFinalPrice = (data: typeof formData) => {
    const actualPrice = parseFloat(data.actualPrice);
    if (!discounted || isNaN(actualPrice)) {
      setFormData((prev) => ({ ...prev, finalPrice: data.actualPrice }));
      return;
    }
    const discountValue = parseFloat(data.discountedPrice);
    if (isNaN(discountValue)) return;

    let finalPrice: number;
    if (data.discountType === "percentage") {
      finalPrice = actualPrice - (actualPrice * discountValue) / 100;
    } else if (data.discountType === "price") {
      finalPrice = actualPrice - discountValue;
    } else {
      finalPrice = actualPrice;
    }
    setFormData((prev) => ({ ...prev, finalPrice: finalPrice.toFixed(2) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        imageUrl: selectedImageUrl,
        addedBy: userData?.uid,
        addedAt: serverTimestamp(),
      });

      toast.success("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        status: "active",
        stock: "",
        actualPrice: "",
        discountedPrice: "",
        discountType: "",
        finalPrice: "",
        productType: "",
        subType: "",
      });
      setSelectedImageUrl(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Product" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <form onSubmit={handleSubmit} className="w-full p-6">
            {/* Product Type Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="productType"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Product Type
              </label>
              <select
                id="productType"
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary text-black dark:text-white"
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

            {/* Image Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Product Image
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-4">
                {availableImages.map((url, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer aspect-square ${
                      selectedImageUrl === url ? "ring-2 ring-primary" : ""
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
            {/* Sub-Type Dropdown */}
            {formData.productType && (
              <div className="mb-4">
                <label
                  htmlFor="subType"
                  className="mb-2 block text-sm font-medium text-black dark:text-white"
                >
                  Product Sub-Type
                </label>
                <select
                  id="subType"
                  name="subType"
                  value={formData.subType}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
                >
                  <option
                    value=""
                    className=" text-black dark:text-white dark:bg-black bg-white"
                  >
                    Select Sub-Type
                  </option>
                  {subTypeOptions[formData.productType]?.map((subType) => (
                    <option
                      className=" text-black dark:text-white dark:bg-black bg-white"
                      key={subType}
                      value={subType}
                    >
                      {subType}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Name Auto-fill from Image */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
              ></textarea>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
              >
                <option
                  className=" text-black dark:text-white dark:bg-black bg-white"
                  value="active"
                >
                  Active
                </option>
                <option
                  className=" text-black dark:text-white dark:bg-black bg-white"
                  value="inactive"
                >
                  Inactive
                </option>
              </select>
            </div>

            {/* Stock */}
            <div className="mb-4">
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Actual Price */}
              <div>
                <label
                  htmlFor="actualPrice"
                  className="mb-2 block text-sm font-medium text-black dark:text-white"
                >
                  Actual Price(per unit)
                </label>
                <input
                  type="number"
                  id="actualPrice"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
                />
              </div>

              {/* Discount Toggle */}
              <div className="flex items-center">
                <label
                  htmlFor="discounted"
                  className="mb-2 block text-sm font-medium text-black dark:text-white cursor-pointer"
                >
                  Discountable Product?
                  {/* Toggle Switch */}
                  <div className="relative ml-2 mt-1">
                    <input
                      type="checkbox"
                      id="discounted"
                      className="sr-only cursor-pointer"
                      checked={discounted}
                      onChange={() => setDiscounted(!discounted)}
                    />
                    <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        discounted &&
                        "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                      }`}
                    >
                      <span className={`hidden ${discounted && "!block"}`}>
                        <svg
                          className="fill-white dark:fill-black"
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill=""
                            stroke=""
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                      <span className={`${discounted && "hidden"}`}>
                        <svg
                          className="h-4 w-4 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {discounted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Discount Type */}
                <div>
                  <label
                    htmlFor="discountType"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
                  >
                    <option
                      className=" text-black dark:text-white dark:bg-black bg-white"
                      value=""
                    >
                      Select Type
                    </option>
                    <option
                      className=" text-black dark:text-white dark:bg-black bg-white"
                      value="percentage"
                    >
                      Percentage
                    </option>
                    <option
                      className=" text-black dark:text-white dark:bg-black bg-white"
                      value="price"
                    >
                      Price
                    </option>
                  </select>
                </div>

                {/* Discounted Price */}
                <div>
                  <label
                    htmlFor="discountedPrice"
                    className="mb-2 block text-sm font-medium text-black dark:text-white"
                  >
                    Discounted Amount/Percentage
                  </label>
                  <input
                    type="number"
                    id="discountedPrice"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Final Price */}
            <div className="mb-4">
              <label
                htmlFor="finalPrice"
                className="mb-2 block text-sm font-medium text-black dark:text-white"
              >
                Final Price
              </label>
              <input
                type="number"
                id="finalPrice"
                name="finalPrice"
                value={formData.finalPrice}
                readOnly
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition text-black dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 px-5 rounded bg-primary text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </DefaultLayout>
  );
};

export default ProductAddForm;
