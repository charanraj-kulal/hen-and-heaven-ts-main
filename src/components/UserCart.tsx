import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  runTransaction,
  updateDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../hooks/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogIn, IterationCcw } from "lucide-react";
import Skeleton from "../components/Skeleton/Skeleton";
import { Link } from "react-router-dom";
import AddressFormDialog from "./AddressFormDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/button";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";

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
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showAddressChangePrompt, setShowAddressChangePrompt] = useState(false);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
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
      fetchUserAddress();
    } else {
      toast.error("Please login to view your cart.");
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

  const fetchCart = async () => {
    if (!userData) {
      toast.error("Please login to view cart.");
      return;
    }

    setIsLoading(true);
    try {
      const cartDoc = await getDoc(doc(db, "userCart", userData.uid));
      if (cartDoc.exists()) {
        const cartItems = cartDoc.data().items || [];
        const updatedCartItems = await Promise.all(
          cartItems.map(async (item: CartItem) => {
            const productDoc = await getDoc(doc(db, "products", item.id));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              return {
                ...item,
                stock: productData.stock,
                status: productData.status,
              };
            }
            return item;
          })
        );
        setCart(updatedCartItems.filter((item) => item.status === "active"));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const updateCart = async (updatedCart: CartItem[]) => {
    if (!userData) {
      toast.error("Please login to update cart.");
      return;
    }

    try {
      await setDoc(doc(db, "userCart", userData.uid), { items: updatedCart });
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart. Please try again.");
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const productRef = doc(db, "products", productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error("Product not found");
      }

      const productData = productDoc.data();
      const currentStock = productData.stock;

      if (newQuantity > currentStock) {
        toast.warning(`Only ${currentStock} items available in stock.`);
        newQuantity = currentStock;
      }

      const updatedCart = cart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity, stock: currentStock };
        }
        return item;
      });

      // Update cart
      await updateCart(updatedCart);

      //   toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const updatedCart = cart.filter((item) => item.id !== productId);
      await updateCart(updatedCart);
      //   toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item. Please try again.");
    }
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
            amount: Math.round(orderDetails.totalAmount * 100),
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
          await refreshProducts();

          try {
            await runTransaction(db, async (transaction) => {
              // First, perform all read operations
              const productReads = cart.map(async (item) => {
                const productRef = doc(db, "products", item.id);
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists()) {
                  throw new Error(`Product ${item.id} not found`);
                }
                return { item, productDoc };
              });

              const productData = await Promise.all(productReads);

              // Now perform all write operations
              for (const { item, productDoc } of productData) {
                const currentProductData = productDoc.data();
                const newStock = currentProductData.stock - item.quantity;

                if (newStock < 0) {
                  throw new Error(`Insufficient stock for product ${item.id}`);
                }

                const productRef = doc(db, "products", item.id);
                transaction.update(productRef, {
                  stock: newStock,
                  status: newStock === 0 ? "inactive" : "active",
                });
              }

              // Create order document
              const completeOrderDetails = {
                ...orderDetails,
                paymentId: response.razorpay_payment_id || null,
                orderId: orderData.id,
                signature: response.razorpay_signature || null,
                status: "placed",
                buyerName: userData.fullName,
                shippingAddress: userAddress,
                createdAt: new Date(),
              };
              const orderRef = doc(collection(db, "orders"));
              transaction.set(orderRef, completeOrderDetails);

              // Clear user's cart
              const cartRef = doc(db, "userCart", userData.uid);
              transaction.set(cartRef, { items: [] });
            });

            setCart([]);

            toast.success("Order placed successfully!");
          } catch (error) {
            console.error("Error processing order:", error);
            toast.error("Failed to process order. Please contact support.");
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
  const refreshProducts = async () => {
    try {
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          const productDoc = await getDoc(doc(db, "products", item.id));
          if (productDoc.exists()) {
            const productData = productDoc.data();
            return {
              ...item,
              stock: productData.stock,
              status: productData.status,
            };
          }
          return item;
        })
      );
      setCart(updatedCart.filter((item) => item.status === "active"));
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Failed to refresh product information.");
    }
  };

  if (!userData) {
    return (
      <section className="dark:bg-black-2 bg-white text-foreground">
        <div className="container mx-auto min-h-screen px-4 py-8 mt-20 flex flex-col items-center justify-center text-center">
          <img
            src="/images/illustration/login-required.png"
            alt="Login Required"
            className="w-1/3 h-auto max-w-sm mb-8"
          />
          <h2 className="text-2xl font-semibold mb-4">
            Please login to view your cart
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be logged in to access your cart and make purchases.
          </p>
          <Link
            to="/login-register"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-900 px-6 py-2 font-medium text-white transition-colors"
          >
            <LogIn size={20} className="mr-2" />
            Login
          </Link>
        </div>
      </section>
    );
  }

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
            <img
              src="/images/illustration/empty-cart.png"
              alt="Empty Cart"
              className="w-1/3 h-auto max-w-sm"
            />
            <div className="inline-flex flex-col mt-10 justify-center space-y-2">
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                Your cart is empty.
              </p>
              <p className="text-md text-gray-600 dark:text-gray-300">
                Go add something! We're waiting to serve you.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-4 py-2 font-medium text-white transition-colors"
            >
              <IterationCcw size={20} className="mr-1 mt-0.5" />
              Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <CartItems
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
            <OrderSummary
              orderDetails={orderDetails}
              handleCheckout={handleCheckout}
            />
          </div>
        )}
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
      </div>
    </section>
  );
};

export default UserCart;
