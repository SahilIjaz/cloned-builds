"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface Component {
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
}

interface CartItem {
  buildId: string;
  buildName: string;
  components: Component[];
  totalPrice: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          // No cart exists yet
          setCart(null);
        } else {
          throw new Error(data.error || "Failed to fetch cart");
        }
      } else {
        setCart(data.cart);
      }
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      toast.error(error.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (buildId: string) => {
    setRemovingItem(buildId);
    try {
      const response = await fetch("/api/cart/remove-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ buildId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove item");
      }

      toast.success("Item removed from cart");
      fetchCart();
    } catch (error: any) {
      console.error("Error removing item:", error);
      toast.error(error.message || "Failed to remove item from cart");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckingOut(true);
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast.error(error.message || "Failed to proceed to checkout");
      setCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  if (loading || status === "loading") {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#7ED348] mx-auto mb-4" />
          <p className="text-gray-400">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center pb-20 pt-20 mt-8 mb-16 bg-slate-950">
      <div className="max-w-[1440px] w-[90%]">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/builds")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 inline-block text-transparent bg-clip-text font-bold text-4xl md:text-6xl">
            Cart
          </h1>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-6">Your cart is empty</p>
            <button
              onClick={() => router.push("/browse")}
              className="bg-[#7ED348] hover:bg-[#6BC23A] text-black font-medium px-6 py-3 rounded-lg transition-all"
            >
              Browse Components
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            {cart.items.map((item) => (
              <div
                key={item.buildId}
                className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {item.buildName}
                    </h2>
                    <p className="text-gray-400">
                      {item.components.length} component
                      {item.components.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.buildId)}
                    disabled={removingItem === item.buildId}
                    className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {removingItem === item.buildId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Components List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {item.components.map((component, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0a0e1a] rounded-lg p-3 flex items-center gap-3"
                    >
                      {component.imageUrl ? (
                        <Image
                          src={component.imageUrl}
                          alt={component.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-slate-800 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xl">?</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {component.name}
                        </p>
                        <p className="text-[#7ED348] text-xs">
                          ${component.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Build Total */}
                <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
                  <span className="text-gray-400 font-medium">
                    Build Total:
                  </span>
                  <span className="text-[#7ED348] text-2xl font-bold">
                    ${item.totalPrice}
                  </span>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Total:</h2>
                <p className="text-[#7ED348] font-bold text-4xl">
                  ${calculateTotal()}
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkingOut ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ShoppingCart className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
