import React, { useState, useEffect } from "react";
import { collection, doc, setDoc, getDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../hooks/UserContext";
import { toast } from "react-toastify";
import {
  PlusCircle,
  MinusCircle,
  Trash2,
  IterationCcw,
  WalletCards,
} from "lucide-react";
import Skeleton from "../components/Skeleton/Skeleton";
import { Link } from "react-router-dom";

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
  productSubType: string;
}

interface CartItem extends ProductItem {
  quantity: number;
}

interface OrderDetails {
  buyerId: string;
  products: CartItem[];
  totalProducts: number;
  productPrice: number;
  gst: number;
  convenienceFee: number;
  totalAmount: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const UserCart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { userData } = useUser();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    buyerId: "",
    products: [],
    totalProducts: 0,
    productPrice: 0,
    gst: 0,
    convenienceFee: 0,
    totalAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      fetchCart();
    }
  }, [userData]);

  useEffect(() => {
    calculateOrderDetails();
  }, [cart]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchCart = async () => {
    if (!userData) return;

    setIsLoading(true);
    try {
      const cartDoc = await getDoc(doc(db, "userCart", userData.uid));
      if (cartDoc.exists()) {
        setCart(cartDoc.data().items || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const updateCart = async (updatedCart: CartItem[]) => {
    if (!userData) return;

    try {
      await setDoc(doc(db, "userCart", userData.uid), { items: updatedCart });
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart. Please try again.");
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        if (newQuantity > item.stock) {
          toast.warning(`Only ${item.stock} items available in stock.`);
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    updateCart(updatedCart);
  };

  const calculateOrderDetails = () => {
    const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);
    const productPrice = cart.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    );
    const gst = productPrice * 0.18;
    const convenienceFee = productPrice * 0.02;
    const totalAmount = productPrice + gst + convenienceFee;

    setOrderDetails({
      buyerId: userData?.uid || "",
      products: cart,
      totalProducts,
      productPrice,
      gst,
      convenienceFee,
      totalAmount,
    });
  };

  const handleCheckout = async () => {
    if (!userData) {
      toast.error("Please login to checkout.");
      return;
    }
    console.log(orderDetails.totalAmount);
    try {
      const response = await fetch(
        "http://localhost:5000/api/create-razorpay-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: orderDetails.totalAmount, // Convert to paise
          }),
        }
      );
      const orderData = await response.json();
      console.log(orderData);
      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded. Please try again later.");
        return;
      }

      const options = {
        key: "rzp_test_X45n8vinhpSHdY", // Replace with your actual Razorpay test key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hen and Heaven",
        image:
          "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/razorpay%20logo%20(1).png",
        description: "Cart Checkout",
        order_id: orderData.id,
        handler: async function (response: any) {
          console.log("Razorpay response:", response);

          const completeOrderDetails = {
            ...orderDetails,
            paymentId: response.razorpay_payment_id || null,
            orderId: orderData.id,
            signature: response.razorpay_signature || null,
            createdAt: new Date(),
          };

          try {
            await addDoc(collection(db, "orders"), completeOrderDetails);
            await setDoc(doc(db, "userCart", userData.uid), { items: [] });
            setCart([]);
            toast.success("Order placed successfully!");
          } catch (error) {
            console.error("Error storing order:", error);
            toast.error(
              "Failed to store order details. Please contact support."
            );
          }
        },
        prefill: {
          name: userData.displayName,
          email: userData.email,
        },
        theme: {
          color: "#121212",
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
    <section className="dark:bg-black-2 bg-white text-foreground">
      <div className="container mx-auto min-h-screen px-4 py-8 mt-30">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center mb-4">
                  <Skeleton className="w-20 h-20 mr-4" />
                  <div>
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/3">
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen text-center">
            {/* Empty Cart Image */}
            <img
              src="/images/illustration/empty-cart.png"
              alt="Empty Cart"
              className="w-1/3 h-auto max-w-sm"
            />

            {/* Empty Cart Text */}
            <div className="inline-flex flex-col mt-10 justify-center space-y-2">
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                Your cart is empty.
              </p>
              <p className="text-md text-gray-600 dark:text-gray-300">
                Go add something! We're waiting to serve you.
              </p>
            </div>

            {/* Button to Go Back to Products */}
            <Link
              to="/products"
              className=" mt-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-4 py-2 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <IterationCcw size={20} className="mr-1 mt-0.5" />
              Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between border-b py-4"
                >
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p>₹{item.finalPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      className="p-1 mr-1 disabled:opacity-50"
                    >
                      <MinusCircle size={18} />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity === item.stock}
                      className="p-1 ml-1 disabled:opacity-50"
                    >
                      <PlusCircle size={18} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full md:w-1/3">
              <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <p>Total Products: {orderDetails.totalProducts}</p>
                  <p>Product Price: ₹{orderDetails.productPrice.toFixed(2)}</p>
                  <p>GST (18%): ₹{orderDetails.gst.toFixed(2)}</p>
                  <p>
                    Convenience Fee (2%): ₹
                    {orderDetails.convenienceFee.toFixed(2)}
                  </p>
                  <p className="font-bold text-lg">
                    Total Amount: ₹{orderDetails.totalAmount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="inline-flex mt-6 w-full h-10 items-center justify-center rounded-md
                  bg-gradient-to-r from-blue-500 to-blue-900 px-4 font-medium
                  text-white transition-colors focus:outline-none focus:ring-2
                  focus:ring-slate-900 focus:ring-offset-2
                  focus:ring-offset-slate-50"
                >
                  <WalletCards size={20} className="mr-1" />
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserCart;
