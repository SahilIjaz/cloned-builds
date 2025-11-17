"use client";

import { useState, useEffect } from "react";
import { X, PlusCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Build {
  _id: string;
  name: string;
  components?: any;
  totalPrice?: number;
}

interface BuildSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: {
    category: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function BuildSelectionModal({
  isOpen,
  onClose,
  component,
}: BuildSelectionModalProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingToBuild, setAddingToBuild] = useState<string | null>(null);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newBuildName, setNewBuildName] = useState("");
  const [creatingBuild, setCreatingBuild] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      fetchUserBuilds();
    }
  }, [isOpen, session]);

  const fetchUserBuilds = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/builds/user");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch builds");
      }

      setBuilds(data.builds || []);
    } catch (error: any) {
      console.error("Error fetching builds:", error);
      toast.error(error.message || "Failed to load builds");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToExistingBuild = async (buildId: string) => {
    setAddingToBuild(buildId);
    try {
      const response = await fetch("/api/builds/add-to-existing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buildId,
          componentType: component.category,
          componentName: component.name,
          componentPrice: component.price,
          componentImage: component.imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add component");
      }

      toast.success(
        `${component.name} added to ${data.build.name} successfully!`,
        {
          duration: 3000,
          icon: "✅",
        }
      );

      onClose();

      // Optional: redirect to the build page
      setTimeout(() => {
        router.push(`/builds/${buildId}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error adding to build:", error);
      toast.error(error.message || "Failed to add component to build");
    } finally {
      setAddingToBuild(null);
    }
  };

  const handleCreateNewBuild = async () => {
    if (!newBuildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    setCreatingBuild(true);
    try {
      const response = await fetch("/api/builds/create-with-component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buildName: newBuildName.trim(),
          componentType: component.category,
          componentName: component.name,
          componentPrice: component.price,
          componentImage: component.imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create build");
      }

      toast.success(
        `New build "${newBuildName}" created with ${component.name}!`,
        {
          duration: 3000,
          icon: "✅",
        }
      );

      onClose();
      setNewBuildName("");
      setShowCreateInput(false);

      // Redirect to the new build page
      setTimeout(() => {
        router.push(`/builds/${data.build._id}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error creating build:", error);
      toast.error(error.message || "Failed to create build");
    } finally {
      setCreatingBuild(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a1628] border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">
            <span className="text-blue-500">Your</span>{" "}
            <span className="text-[#7ED348]">Builds</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#7ED348]" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Existing Builds */}
              {builds.length > 0 && (
                <div className="space-y-3">
                  {builds.map((build) => (
                    <button
                      key={build._id}
                      onClick={() => handleAddToExistingBuild(build._id)}
                      disabled={addingToBuild === build._id}
                      className="w-full bg-[#7ED348] hover:bg-[#6BC23A] transition-all text-black font-medium px-6 py-4 rounded-lg flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <PlusCircle className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-semibold">{build.name}</p>
                          {build.totalPrice !== undefined && (
                            <p className="text-sm opacity-80">
                              Current total: ${build.totalPrice}
                            </p>
                          )}
                        </div>
                      </div>
                      {addingToBuild === build._id && (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Create New Build Button/Input */}
              {!showCreateInput ? (
                <button
                  onClick={() => setShowCreateInput(true)}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-6 py-4 rounded-lg transition-all"
                >
                  create a new build
                </button>
              ) : (
                <div className="bg-[#1a1f2e] border border-slate-700 rounded-lg p-4 space-y-4">
                  <div>
                    <label
                      htmlFor="build-name"
                      className="block text-white font-medium mb-2"
                    >
                      build name
                    </label>
                    <input
                      id="build-name"
                      type="text"
                      value={newBuildName}
                      onChange={(e) => setNewBuildName(e.target.value)}
                      placeholder="e.g : my build"
                      className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateNewBuild();
                        }
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateNewBuild}
                      disabled={creatingBuild || !newBuildName.trim()}
                      className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {creatingBuild ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "create"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateInput(false);
                        setNewBuildName("");
                      }}
                      disabled={creatingBuild}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
