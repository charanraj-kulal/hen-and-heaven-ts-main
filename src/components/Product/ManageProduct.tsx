import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  PlusCircle,
  MinusCircle,
  Pencil,
  Trash,
  Save,
  Plus,
} from "lucide-react";
import { db } from "../../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "../Layouts/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import EditInventoryModal from "./EditInventoryModal";
import AddInventoryImageModal from "./AddInventoryImageModal";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  cost: number;
  status: "active" | "inactive";
  imageUrl: string;
}

interface InventoryItemWithChanges extends InventoryItem {
  hasChanges: boolean;
  newQuantity: number;
  newCost: number;
}

const ManageInventory: React.FC = () => {
  const [inventoryItems, setInventoryItems] = useState<
    InventoryItemWithChanges[]
  >([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    const q = query(collection(db, "inventory"));
    const querySnapshot = await getDocs(q);
    const items: InventoryItemWithChanges[] = [];
    querySnapshot.forEach((doc) => {
      const item = doc.data() as InventoryItem;
      items.push({
        ...item,
        id: doc.id,
        hasChanges: false,
        newQuantity: item.quantity,
        newCost: item.cost,
      });
    });
    setInventoryItems(items);
  };

  const handleQuantityChange = (id: string, change: number) => {
    setInventoryItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              newQuantity: Math.max(0, item.newQuantity + change),
              hasChanges: true,
            }
          : item
      )
    );
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setInventoryItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, newCost: newPrice, hasChanges: true } : item
      )
    );
  };

  const handleSave = async (item: InventoryItemWithChanges) => {
    await updateDoc(doc(db, "inventory", item.id), {
      quantity: item.newQuantity,
      cost: item.newCost,
    });
    await fetchInventoryItems();
    toast.success("Item updated successfully");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "inventory", id));
      await fetchInventoryItems();
      toast.success("Item deleted successfully");
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedItem: InventoryItem) => {
    const itemData = {
      name: updatedItem.name,
      description: updatedItem.description,
      quantity: updatedItem.quantity,
      cost: updatedItem.cost,
      status: updatedItem.status,
      imageUrl: updatedItem.imageUrl,
    };

    await updateDoc(doc(db, "inventory", updatedItem.id), itemData);
    await fetchInventoryItems();
    setIsEditModalOpen(false);
    toast.success("Item updated successfully");
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage Inventory" />
      <div className="rounded-sm border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Inventory Items</h2>
            <button
              onClick={() => setIsAddImageModalOpen(true)}
              className="btn btn-primary border border-black dark:border-white/30 hover:bg-black hover:text-white transition-all p-2 rounded-md flex items-center gap-1"
            >
              <Plus size={15} />
              Inventory Images
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto justify-center items-center">
              <thead className="justify-center items-center">
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="justify-center items-center">
                {inventoryItems.map((item) => (
                  <tr key={item.id}>
                    <td className="flex border-b border-[#eee] px-4 py-3 justify-start dark:border-strokedark xl:pl-11">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-12.5 w-15 rounded-md">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        </div>
                        <p className="text-sm text-black dark:text-white">
                          {item.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={() => handleQuantityChange(item.id, -1)}>
                        <MinusCircle size={14} />
                      </button>
                      <span className="mx-2">{item.newQuantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, 1)}>
                        <PlusCircle size={14} />
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.newCost}
                        onChange={(e) =>
                          handlePriceChange(item.id, Number(e.target.value))
                        }
                        className="w-24 px-2 py-1 border rounded bg-black-2/20 text-black-2 dark:text-white"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 items-center px-3 py-1 text-sm font-medium ${
                          item.status === "active"
                            ? "bg-success text-success"
                            : item.status === "inactive"
                            ? "bg-danger text-danger"
                            : "bg-warning text-warning"
                        }`}
                      >
                        {item.status}
                      </p>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-primary mr-3"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-danger mr-3"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        onClick={() => handleSave(item)}
                        disabled={!item.hasChanges}
                      >
                        <Save
                          size={18}
                          className={` ${
                            item.hasChanges
                              ? "dark:text-white text-black-2"
                              : "text-gray-500"
                          }`}
                        />
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
        <EditInventoryModal
          item={editingItem}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      <AddInventoryImageModal
        isOpen={isAddImageModalOpen}
        onClose={() => setIsAddImageModalOpen(false)}
        onImagesAdded={fetchInventoryItems}
      />
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

export default ManageInventory;
