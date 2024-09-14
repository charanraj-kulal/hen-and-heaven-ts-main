import React from "react";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  finalPrice: number;
  quantity: number;
  stock: number;
}

interface CartItemsProps {
  cart: CartItem[];
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
  cart,
  updateQuantity,
  removeFromCart,
}) => {
  return (
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
  );
};

export default CartItems;
