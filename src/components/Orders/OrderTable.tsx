import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DefaultLayout from "../Layouts/DefaultLayout";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

export type Order = {
  id: string;
  buyerId: string;
  buyerName: string;
  shippingAddress: Array<{
    city: string;
    country: string;
    state: string;
    street: string;
    zipCode: string;
  }>;
  // shippingAddress: String;
  // city: string;
  // country: string;
  // state: string;
  // street: string;
  // zipCode: string;
  createdAt: Date;
  productPrice: number;
  totalProducts: number;
  status: "placed" | "shipped" | "delivered";
  products: Array<{
    name: string;
    imageUrl: string;
    quantity: number;
    finalPrice: number;
  }>;
};

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const ordersData: Order[] = [];
      const buyerIdsSet = new Set<string>();

      querySnapshot.forEach((doc) => {
        const order = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as Order;
        ordersData.push(order);
        buyerIdsSet.add(order.buyerId);
      });

      setOrders(ordersData);

      // Fetch buyer names
      const buyerIds = Array.from(buyerIdsSet);
      const buyerNamesData: Record<string, string> = {};
      await Promise.all(
        buyerIds.map(async (buyerId) => {
          const buyerDoc = await getDoc(doc(db, "users", buyerId));
          if (buyerDoc.exists()) {
            buyerNamesData[buyerId] = buyerDoc.data().fullName;
          } else {
            buyerNamesData[buyerId] = "Unknown Buyer"; // Fallback if buyer data doesn't exist
          }
        })
      );

      setBuyerNames(buyerNamesData);
    });

    return () => unsubscribe();
  }, []);

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "products",
      header: "Product",
      cell: ({ row }) => {
        const product = (row.getValue("products") as Order["products"])[0];
        return (
          <div className="flex items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-10 h-10 mr-2 object-cover"
            />
            <span>{product.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "buyerId",
      header: "Buyer Name",
      cell: ({ row }) => {
        const buyerId = row.getValue("buyerId") as string;
        const buyerName = buyerNames[buyerId] || "Loading...";
        return <div>{buyerName}</div>;
      },
    },
    {
      accessorKey: "productPrice",
      header: "Price",
      cell: ({ row }) => <div>₹{row.getValue("productPrice")}</div>,
    },
    {
      accessorKey: "totalProducts",
      header: "Quantity",
      cell: ({ row }) => <div>{row.getValue("totalProducts")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let bgColor = "";
        switch (status) {
          case "placed":
            bgColor = "bg-red-400";
            break;
          case "shipped":
            bgColor = "bg-yellow-200";
            break;
          case "delivered":
            bgColor = "bg-green-300";
            break;
          default:
            bgColor = "bg-gray-300";
        }
        return (
          <div
            className={`px-2 py-1 rounded-full text-black-2 text-center ${bgColor}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{row.getValue<Date>("createdAt").toLocaleDateString()}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "placed")}
              >
                Mark as Placed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "shipped")}
              >
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "delivered")}
              >
                Mark as Delivered
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete Order
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the order.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteOrder(order.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="All Orders" />
      <div className="rounded-sm border p-4 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search by buyer name..."
            value={
              (table.getColumn("buyerId")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("buyerId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm mr-4"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </DefaultLayout>
  );
};

export default OrdersTable;
