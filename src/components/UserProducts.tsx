import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase"; // adjust path to your firebase setup
import { MagicCard } from "../components/magicui/magic-card";
import { useUser } from "../hooks/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductModal from "../components/ProductModal";
import { List, ShoppingCart } from "lucide-react";
import ProductSkeleton from "../components/Skeleton/ProductSkeleton";

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
const ProductBuyingPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { userData } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "products"),
        where("status", "==", "active")
      );
      const querySnapshot = await getDocs(q);
      const productsArray: ProductItem[] = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() } as ProductItem);
      });
      setProducts(productsArray);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const sortProducts = (productsToSort: ProductItem[]) => {
    return productsToSort.sort((a, b) => {
      const priceA = a.finalPrice;
      const priceB = b.finalPrice;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const addToCart = async (product: ProductItem) => {
    if (!userData) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const userCartRef = doc(db, "userCart", userData.uid);
      const userCartDoc = await getDoc(userCartRef);

      if (userCartDoc.exists()) {
        const existingCart = userCartDoc.data().items || [];
        const existingItemIndex = existingCart.findIndex(
          (item: CartItem) => item.id === product.id
        );

        if (existingItemIndex !== -1) {
          toast.info(
            "Item already in cart. You can update the quantity in the cart page."
          );
          return;
        }

        const updatedCart = [...existingCart, { ...product, quantity: 1 }];
        await setDoc(userCartRef, { items: updatedCart }, { merge: true });
      } else {
        await setDoc(userCartRef, { items: [{ ...product, quantity: 1 }] });
      }

      toast.success("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  const openModal = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };
  const renderProductSection = (productType: string) => {
    const filteredProducts = products.filter(
      (product) => product.productType === productType
    );
    const sortedProducts = sortProducts(filteredProducts);

    return (
      <div key={productType} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
          {productType.replace("-", " & ")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : sortedProducts.map((product) => (
                <MagicCard
                  key={product.id}
                  className="relative transition duration-700 ease-in-out flex flex-col items-center justify-between p-4 border border-white/30 hover:border-white/50 rounded-xl"
                  gradientColor="#FF5733"
                >
                  {product.discountedPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      OFFER
                    </div>
                  )}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    {product.discountedPrice ? (
                      <>
                        <p className="text-gray-500 dark:text-gray-400 line-through mr-2">
                          ₹{product.actualPrice}
                        </p>
                        <p className="text-green-600 dark:text-green-400 font-bold">
                          ₹{product.finalPrice}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-900 dark:text-white font-bold">
                        ₹{product.finalPrice}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(product)}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-blue-900 px-4 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                      <List size={20} className="mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-red-900 px-4 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                      <ShoppingCart size={20} className="mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </MagicCard>
              ))}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white dark:bg-black-2">
      <div className="container mx-auto px-4 py-8  ">
        <div className="flex justify-between items-center mb-8 mt-30">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Products
          </h1>
          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Sort by Price: {sortOrder === "asc" ? "Low to High" : "High to Low"}
          </button>
        </div>
        {renderProductSection("eggs")}
        {renderProductSection("chickens")}
        {renderProductSection("hens-and-chicks")}
        {renderProductSection("bulk-eggs-chickens-feeds")}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            addToCart={addToCart}
            onClose={closeModal}
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
      </div>
    </section>
  );
};

export default ProductBuyingPage;
