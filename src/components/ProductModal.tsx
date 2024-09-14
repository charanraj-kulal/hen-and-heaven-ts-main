import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, ShoppingCart, X } from "lucide-react";
import { useUser } from "../hooks/UserContext"; // adjust path as needed
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path to your firebase setup
import { toast } from "react-toastify";

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBuyNow = async () => {
    if (!userData) {
      toast.error("Please login to proceed with the purchase.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: product.finalPrice,
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
          console.log("Razorpay response:", response);
          // Calculate order details
          const gst = product.finalPrice * 0.18;
          const convenienceFee = product.finalPrice * 0.02;
          const totalAmount = product.finalPrice + gst + convenienceFee;

          // Create order object
          const orderDetails = {
            buyerId: userData.uid,
            products: [{ ...product, quantity: 1 }],
            totalProducts: 1,
            productPrice: product.finalPrice,
            gst: gst,
            convenienceFee: convenienceFee,
            totalAmount: totalAmount,
            paymentId: response.razorpay_payment_id || null,
            orderId: orderData.id, // Use the order ID from the server response
            signature: response.razorpay_signature || null,
            createdAt: new Date(),
          };

          // Store order in Firestore
          try {
            await addDoc(collection(db, "orders"), orderDetails);
            toast.success("Order placed successfully!");
          } catch (error) {
            console.error("Error storing order:", error);
            toast.error(
              "Failed to store order details. Please contact support."
            );
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
  );
};

export default ProductModal;
