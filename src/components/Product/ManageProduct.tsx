import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Pencil, Trash, Save, Plus } from "lucide-react";
import { db } from "../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import EditProductModal from "./EditProductModal";

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
}

interface ProductItemWithChanges extends ProductItem {
  hasChanges: boolean;
  newStock: number;
  newFinalPrice: number;
}

const ManageProduct: React.FC = () => {
  const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productItems, setProductItems] = useState<ProductItemWithChanges[]>(
    []
  );

  useEffect(() => {
    fetchProductItems();
  }, []);

  const fetchProductItems = async () => {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const items: ProductItemWithChanges[] = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data() as ProductItem;
      items.push({
        ...item,
        id: doc.id,
        hasChanges: false,
        newStock: item.stock,
        newFinalPrice: item.finalPrice,
      });
    });
    setProductItems(items);
  };

  const handleStockChange = (id: string, newQuantity: number) => {
    setProductItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              newStock: newQuantity,
              hasChanges: true,
            }
          : item
      )
    );
  };

  const handleStatusToggle = (id: string) => {
    setProductItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
              hasChanges: true,
            }
          : item
      )
    );
  };

  const handleSave = async (item: ProductItemWithChanges) => {
    await updateDoc(doc(db, "products", item.id), {
      stock: item.newStock,
      status: item.status,
      finalPrice: item.newFinalPrice,
    });
    await fetchProductItems();
    toast.success("Product updated successfully");
  };
  const handleEdit = (item: ProductItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      await fetchProductItems();
      toast.success("Product deleted successfully");
    }
  };
  const handleUpdate = async (updatedItem: ProductItem) => {
    const itemData = {
      name: updatedItem.name,
      description: updatedItem.description,
      actualPrice: updatedItem.actualPrice,
      discountType: updatedItem.discountType,
      discountedPrice: updatedItem.discountedPrice,
      stock: updatedItem.stock,
      status: updatedItem.status,
      finalPrice: updatedItem.finalPrice,
      imageUrl: updatedItem.imageUrl,
    };

    await updateDoc(doc(db, "products", updatedItem.id), itemData);
    await fetchProductItems();
    setIsEditModalOpen(false);
    toast.success("Item updated successfully");
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Products" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-7.5">
          <h2 className="text-xl font-semibold mb-4">Product List</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-2 text-left dark:bg-meta-4">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Actual Price</th>
                  <th className="px-4 py-2">Discount Type</th>
                  <th className="px-4 py-2">Disc Amt/Percent</th>
                  <th className="px-4 py-2">Final Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {productItems.map((item) => (
                  <tr key={item.id}>
                    <td className="flex items-center px-4 py-2 max-w-50 border-b">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="px-2 py-2 border-b">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.newStock}
                        onChange={(e) =>
                          handleStockChange(item.id, Number(e.target.value))
                        }
                        className="w-24 px-2 py-1 border rounded bg-black-2/20 text-black-2 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">{item.actualPrice}</td>
                    <td className="px-4 py-2 border-b">
                      {item.discountType ? item.discountType : "-"}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {item.discountedPrice ? item.discountedPrice : "-"}
                    </td>
                    <td className="px-4 py-2 border-b">{item.newFinalPrice}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.status === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                        onClick={() => handleStatusToggle(item.id)}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 mr-1"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 mr-1"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        onClick={() => handleSave(item)}
                        disabled={!item.hasChanges}
                        className={`mr-3 ${
                          item.hasChanges
                            ? "text-black-2 dark:text-white"
                            : "text-gray-500"
                        }`}
                      >
                        <Save size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {editingItem && (
        <EditProductModal
          item={editingItem}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </DefaultLayout>
  );
};

export default ManageProduct;
