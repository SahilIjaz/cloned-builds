"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Component {
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
}

interface Build {
  _id: string;
  name: string;
  description?: string;
  components?: {
    cpu?: Component;
    gpu?: Component;
    motherboard?: Component;
    ram?: Component;
    storage?: Component;
    psu?: Component;
    case?: Component;
    cooling?: Component;
  };
  totalPrice?: number;
  username: string;
  userImage?: string;
  createdAt: string;
}

const componentDisplayNames: { [key: string]: string } = {
  cpu: "CPU",
  gpu: "Graphics Card",
  motherboard: "Motherboard",
  ram: "Memory (RAM)",
  storage: "Storage",
  psu: "Power Supply",
  case: "Case",
  cooling: "Cooling",
};

export default function BuildDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBuildDetails();
    }
  }, [params.id]);

  const fetchBuildDetails = async () => {
    try {
      const response = await fetch(`/api/builds/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch build details");
      }

      setBuild(data.build);
    } catch (error: any) {
      console.error("Error fetching build:", error);
      toast.error(error.message || "Failed to load build details");
      router.push("/builds");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Please login to add items to cart");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (!build || !build.components) {
      toast.error("No components in this build");
      return;
    }

    setAddingToCart(true);
    try {
      const response = await fetch("/api/cart/add-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buildId: build._id,
          buildName: build.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      toast.success("Build added to cart successfully!", {
        duration: 3000,
        icon: "🛒",
      });

      // Redirect to cart page
      setTimeout(() => {
        router.push("/cart");
      }, 1500);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add build to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRemoveComponent = async (componentType: string) => {
    // Implementation for removing a component from build
    toast.error("Remove component functionality coming soon");
  };

  if (loading || status === "loading") {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#7ED348] mx-auto mb-4" />
          <p className="text-gray-400">Loading build details...</p>
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Build not found</p>
        </div>
      </div>
    );
  }

  const componentsList = build.components
    ? Object.entries(build.components)
        .filter(([_, component]) => component)
        .map(([key, component]) => ({
          type: key,
          ...component,
        }))
    : [];

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
            {build.name}
          </h1>
        </div>

        {/* Build Description */}
        {build.description && (
          <p className="text-gray-400 mb-8 text-lg">{build.description}</p>
        )}

        {/* Components List */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Components</h2>
          {componentsList.length === 0 ? (
            <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-12 text-center">
              <p className="text-gray-400 text-lg">
                No components added to this build yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {componentsList.map((component: any) => (
                <div
                  key={component.type}
                  className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-6 hover:border-[#7ED348] transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Component Image */}
                    {component.imageUrl ? (
                      <div className="flex-shrink-0">
                        <Image
                          src={component.imageUrl}
                          alt={component.name}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-[100px] h-[100px] bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-3xl">?</span>
                      </div>
                    )}

                    {/* Component Details */}
                    <div className="flex-1">
                      <p className="text-[#7ED348] text-sm font-semibold mb-1">
                        {componentDisplayNames[component.type] ||
                          component.type}
                      </p>
                      <h3 className="text-white font-bold text-lg mb-2">
                        {component.name}
                      </h3>
                      <p className="text-[#7ED348] font-semibold text-xl">
                        ${component.price}
                      </p>
                    </div>

                    {/* Remove Button (optional - for future use) */}
                    {/* <button
                      onClick={() => handleRemoveComponent(component.type)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Price Section */}
        <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Total :</h2>
            <p className="text-[#7ED348] font-bold text-4xl">
              ${build.totalPrice || 0}
            </p>
          </div>

          {/* Add to Cart Button */}
          {componentsList.length > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  Add to Cart
                  <ShoppingCart className="w-6 h-6" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Build Meta Info */}
        <div className="text-gray-500 text-sm">
          <p>
            Created by: <span className="text-gray-400">{build.username}</span>
          </p>
          <p>
            Created on:{" "}
            <span className="text-gray-400">
              {new Date(build.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
