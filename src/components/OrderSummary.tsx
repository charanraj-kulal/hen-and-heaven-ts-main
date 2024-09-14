import React from "react";
import { WalletCards } from "lucide-react";

interface OrderDetails {
  totalProducts: number;
  productPrice: number;
  gst: number;
  convenienceFee: number;
  totalAmount: number;
}

interface OrderSummaryProps {
  orderDetails: OrderDetails;
  handleCheckout: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderDetails,
  handleCheckout,
}) => {
  return (
    <div className="w-full md:w-1/3">
      <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <p>Total Products: {orderDetails.totalProducts}</p>
          <p>Product Price: ₹{orderDetails.productPrice.toFixed(2)}</p>
          <p>GST (18%): ₹{orderDetails.gst.toFixed(2)}</p>
          <p>Convenience Fee (2%): ₹{orderDetails.convenienceFee.toFixed(2)}</p>
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
          <WalletCards size={18} className="mr-1" />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
