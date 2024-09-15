import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, ShoppingCart, X } from "lucide-react";
import { useUser } from "../hooks/UserContext"; // adjust path as needed
import {
  collection,
  updateDoc,
  getDoc,
  doc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase"; // adjust path to your firebase setup
import { toast } from "react-toastify";
import AddressFormDialog from "./AddressFormDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/button";
interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  stock: number;
  actualPrice: number;
  discountedPrice: number | null;
  finalPrice: number;
  discountType: "amount" | "percentage" | null;
  productType: string;
  productSubType: string;
  status: "active" | "inactive";
}
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
interface ProductModalProps {
  product: ProductItem;
  addToCart: (product: ProductItem) => Promise<void>;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  addToCart,
  onClose,
}) => {
  const { userData } = useUser();
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showAddressChangePrompt, setShowAddressChangePrompt] = useState(false);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    if (userData) {
      fetchUserAddress();
    } else {
      toast.error("Please login to buy product");
    }
  }, [userData]);
  const fetchUserAddress = async () => {
    if (!userData) return;

    try {
      const userDoc = await getDoc(doc(db, "users", userData.uid));
      if (userDoc.exists() && userDoc.data().address) {
        setUserAddress(userDoc.data().address);
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  };

  const handleAddressSubmit = async (address: Address) => {
    if (!userData) return;

    try {
      await updateDoc(doc(db, "users", userData.uid), { address });
      setUserAddress(address);
      setShowAddressDialog(false);
      setShowAddressChangePrompt(false);
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address. Please try again.");
    }
  };
  const handleBuyNow = async () => {
    if (!userData) {
      toast.error("Please login to checkout.");
      return;
    }

    if (!userAddress) {
      setShowAddressDialog(true);
      return;
    }

    setShowAddressChangePrompt(true);
  };
  const proceedToPayment = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(product.finalPrice * 100),
          }),
        }
      );
      const orderData = await response.json();
      console.log("Order Data:", orderData);

      // Check if Razorpay is available
      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded. Please try again later.");
        return;
      }

      const options = {
        key: "rzp_test_X45n8vinhpSHdY", // Replace with your actual Razorpay test key
        amount: orderData.amount, // This should be in paise
        currency: orderData.currency,
        name: "Hen and Heaven",
        image:
          "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/razorpay%20logo%20(1).png",
        description: `Purchase of ${product.name}`,
        order_id: orderData.id, // This is the order ID returned from your server
        handler: async function (response: any) {
          try {
            await runTransaction(db, async (transaction) => {
              // Read operations
              const productRef = doc(db, "products", product.id);
              const productDoc = await transaction.get(productRef);
              const henAndHeavenRef = doc(
                db,
                "hen-and-heaven",
                "gNfmJEedFjmg8g6I7vMO"
              );
              const henAndHeavenDoc = await transaction.get(henAndHeavenRef);

              if (!productDoc.exists()) {
                throw new Error("Product not found.");
              }
              if (!henAndHeavenDoc.exists()) {
                throw new Error("Hen and Heaven summary not found");
              }

              const currentStock = productDoc.data().stock;
              const henAndHeavenData = henAndHeavenDoc.data();

              if (currentStock <= 0) {
                throw new Error("Product is out of stock.");
              }

              // Calculate order details
              const gst = product.finalPrice * 0.18;
              const convenienceFee = product.finalPrice * 0.02;
              const totalAmount = product.finalPrice + gst + convenienceFee;

              // Create order object
              const orderDetails = {
                buyerId: userData.uid,
                buyerName: userData.fullName,
                products: [{ ...product, quantity: 1 }],
                totalProducts: 1,
                productPrice: product.finalPrice,
                gst: gst,
                convenienceFee: convenienceFee,
                totalAmount: totalAmount,
                paymentId: response.razorpay_payment_id || null,
                orderId: orderData.id,
                signature: response.razorpay_signature || null,
                status: "placed",
                shippingAddress: userAddress,
                createdAt: new Date(),
              };

              // Write operations
              const orderRef = doc(collection(db, "orders"));
              transaction.set(orderRef, orderDetails);

              const updatedStock = currentStock - 1;
              const newStatus = updatedStock === 0 ? "inactive" : "active";
              transaction.update(productRef, {
                stock: updatedStock,
                status: newStatus,
              });

              transaction.update(henAndHeavenRef, {
                totalRevenue: henAndHeavenData.totalRevenue + totalAmount,
                netProfit:
                  henAndHeavenData.netProfit +
                  (totalAmount - gst - convenienceFee),
              });
            });

            toast.success("Order placed successfully!");
          } catch (error) {
            console.error("Error processing order and updating stock:", error);
            toast.error("Failed to complete order. Please contact support.");
          }
          onClose();
        },
        prefill: {
          name: userData.displayName,
          email: userData.email,
        },
        theme: {
          color: "#121212", // Dark theme color
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout form closed");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "An error occurred while processing your payment. Please try again."
      );
    }
  };
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <X size={24} className="cursor-pointer " onClick={onClose} />
            </div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {product.description}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-300">
                Stock: {product.stock}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                Type: {product.productType}
              </span>
            </div>
            <div className="flex items-center justify-between mb-6">
              {product.discountedPrice ? (
                <>
                  <span className="text-gray-500 dark:text-gray-400 line-through">
                    ₹{product.actualPrice}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold text-xl">
                    ₹{product.finalPrice}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 dark:text-white font-bold text-xl">
                  ₹{product.finalPrice}
                </span>
              )}
            </div>
            {/* ... (rest of the component remains the same) ... */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="inline-flex h-10 items-center justify-center rounded-md
                  bg-gradient-to-r from-red-500 to-red-900 px-4 font-medium
                  text-white transition-colors focus:outline-none focus:ring-2
                  focus:ring-slate-900 focus:ring-offset-2
                  focus:ring-offset-slate-50"
              >
                <ShoppingCart size={20} className="mr-1" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="inline-flex h-10 items-center justify-center rounded-md
                  bg-gradient-to-r from-blue-500 to-blue-900 px-4 font-medium
                  text-white transition-colors focus:outline-none focus:ring-2
                  focus:ring-slate-900 focus:ring-offset-2
                  focus:ring-offset-slate-50"
              >
                <ShoppingBasket size={20} className="mr-1" />
                Buy Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <AddressFormDialog
        isOpen={showAddressDialog}
        onClose={() => setShowAddressDialog(false)}
        onSubmit={handleAddressSubmit}
        existingAddress={userAddress || undefined}
      />

      <Dialog
        open={showAddressChangePrompt}
        onOpenChange={setShowAddressChangePrompt}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Address</DialogTitle>
          </DialogHeader>
          <p>Do you want to use your existing address or update it?</p>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowAddressChangePrompt(false);
                proceedToPayment();
              }}
            >
              Use Existing
            </Button>
            <Button
              onClick={() => {
                setShowAddressChangePrompt(false);
                setShowAddressDialog(true);
              }}
            >
              Update Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductModal;
