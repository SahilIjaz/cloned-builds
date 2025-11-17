"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Package, X } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  buildId: string;
  buildName: string;
  components: {
    name: string;
    price: number;
    imageUrl?: string;
    category: string;
  }[];
  totalPrice: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "checkout" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export default function TrackingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "checkout":
        return "text-blue-500";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading || status === "loading") {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#7ED348] mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center pb-20 pt-20 mt-8 mb-16 bg-slate-950 min-h-screen">
      <div className="max-w-[1440px] w-[90%]">
        <h1 className="bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 inline-block text-transparent bg-clip-text font-bold text-4xl md:text-6xl mb-8">
          Order Tracking
        </h1>

        {orders.length === 0 ? (
          <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-6">No orders found</p>
            <button
              onClick={() => router.push("/browse")}
              className="bg-[#7ED348] hover:bg-[#6BC23A] text-black font-medium px-6 py-3 rounded-lg transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-6 cursor-pointer hover:border-[#7ED348] transition-all"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-white">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <span
                        className={`text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">
                      {order.items.length} build
                      {order.items.length !== 1 ? "s" : ""} • Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#7ED348] text-2xl font-bold">
                      ${order.totalAmount}
                    </p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0e1a] border border-slate-600 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0a0e1a] border-b border-slate-600 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Order Details
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Order #{selectedOrder._id.slice(-8)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Order Status */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 font-medium">Status</span>
                    <span
                      className={`text-lg font-bold ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {formatStatus(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-medium">
                      Total Amount
                    </span>
                    <span className="text-[#7ED348] text-2xl font-bold">
                      ${selectedOrder.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-3">
                    Items in this order
                  </h3>
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold">
                          {item.buildName}
                        </h4>
                        <span className="text-[#7ED348] font-bold">
                          ${item.totalPrice}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {item.components.map((component, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-gray-400">
                              {component.name}
                            </span>
                            <span className="text-gray-300">
                              ${component.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Timeline */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-3">
                    Order Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#7ED348] rounded-full mt-1.5" />
                      <div>
                        <p className="text-white font-medium">Order Placed</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.status === "checkout" && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                        <div>
                          <p className="text-white font-medium">
                            Processing Payment
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(selectedOrder.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.status === "completed" && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
                        <div>
                          <p className="text-white font-medium">
                            Order Completed
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(selectedOrder.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
