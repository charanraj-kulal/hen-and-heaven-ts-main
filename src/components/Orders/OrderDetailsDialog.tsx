import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Order } from "./OrderTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface OrderDetailsDialogProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[805px] sm:max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order ID: {order.id}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Buyer Name:</TableCell>
                <TableCell>{order.buyerName || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Created At:</TableCell>
                <TableCell>
                  {order.createdAt ? order.createdAt.toLocaleString() : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Status:</TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Total Products:</TableCell>
                <TableCell>{order.totalProducts}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Product Price:</TableCell>
                <TableCell>₹{order.productPrice}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h4 className="font-medium mt-4 mb-2">Products:</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₹{product.finalPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
