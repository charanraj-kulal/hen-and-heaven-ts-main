import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  addToCart,
  onClose,
}) => {
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
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {product.name}
          </h2>
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
          <div className="flex justify-between">
            <button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
