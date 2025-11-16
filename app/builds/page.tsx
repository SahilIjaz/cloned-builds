"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Build } from "../../types/buildTypes";


export default function BuildsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Hide header on mount
    const header = document.querySelector('header') || document.querySelector('[class*="fixed"]');
    if (header instanceof HTMLElement) {
      header.style.display = 'none';
    }

    fetchBuilds();

    // Show header on unmount
    return () => {
      const header = document.querySelector('header') || document.querySelector('[class*="fixed"]');
      if (header instanceof HTMLElement) {
        header.style.display = '';
      }
    };
  }, []);

  const fetchBuilds = async () => {
    try {
      const response = await fetch("/api/builds");
      const data = await response.json();
      setBuilds(data.builds || []);
    } catch (error) {
      console.error("Failed to fetch builds:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: buildName,
          description: "",
          isPublic: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create build");
      }

      // Redirect to build detail page
      router.push(`/builds/${data.build._id}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full flex justify-center items-center pb-20 pt-20 mt-8 mb-16">
      <div className="max-w-[1440px] w-[90%]">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-12 md:mb-16 gap-6 md:gap-0">
        <h1 className="bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 inline-block text-transparent bg-clip-text font-bold text-5xl md:text-7xl">
          Builds
        </h1>
        {session && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-[#7ED348] hover:bg-[#6BC23A] transition-all text-black font-medium px-6 py-3 rounded-lg flex items-center gap-2 text-base"
          >
            new build
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </button>
        )}
      </div>

      <div className="flex justify-start w-full min-h-[240px]">
        {/* Builds List */}
        {loading ? (
          <div className="text-center text-gray-400 py-20 w-full">
            Loading builds...
          </div>
        ) : builds.length === 0 ? (
          <div className="text-center py-20 w-full">
            <p className="text-gray-400 text-lg mb-4">No builds yet</p>
            {session && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[#7ED348] hover:underline"
              >
                Create the first build
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {builds.map((build) => (
              <Link
                key={build._id}
                href={`/builds/${build._id}`}
                className="block bg-[#1e3a8a] rounded-lg p-6 hover:bg-[#1e40af] transition-all border border-blue-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold text-white">
                        {build.name}
                      </h2>
                      {!build.isPublic && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                          Draft
                        </span>
                      )}
                    </div>
                    {build.description && (
                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {build.description}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        {build.userImage ? (
                          <Image
                            src={build.userImage}
                            alt={build.username}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#7ED348] flex items-center justify-center text-black text-xs font-semibold">
                            {build.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-white">{build.username}</span>
                      </div>
                      <span>{formatDate(build.createdAt)}</span>
                      <span>{build.viewCount} views</span>
                      <span>{build.replyCount} replies</span>
                      {build.totalPrice && (
                        <span className="text-[#7ED348] font-semibold">
                          ${build.totalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Build Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1f2e] rounded-lg p-8 max-w-md w-full relative border border-slate-700">
            <button
              onClick={() => {
                setShowModal(false);
                setBuildName("");
                setError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">build name</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBuild}>
              <input
                type="text"
                placeholder="e.g : my build"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                required
                minLength={3}
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348] mb-6"
              />

              <button
                type="submit"
                disabled={creating || buildName.length < 3}
                className="w-full px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "create"}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}