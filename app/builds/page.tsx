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
    <div className="w-full flex justify-center items-center pb-20 pt-20 bg-slate-950 min-h-screen">
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
        {/* Builds Grid */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {builds.map((build) => (
              <div
                key={build._id}
                className="relative bg-[#0a0f1e] rounded-[2rem] overflow-hidden group"
                style={{ aspectRatio: '1/1' }}
              >
                {/* Background Pattern with Gradient */}
                <div className="absolute inset-0">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-cyan-500/20 to-blue-600/40"></div>

                  {/* ID Pattern Background */}
                  <div className="absolute inset-0 p-6 text-[11px] leading-[1.4] break-all font-mono overflow-hidden">
                    <div className="opacity-40 text-green-400">
                      {build._id.repeat(50).slice(0, 600)}
                    </div>
                  </div>
                </div>

                {/* Main Border */}
                <div className="absolute inset-0 rounded-[2rem] border border-gray-600/40"></div>

                {/* Corner Accents - Thin Lines */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ borderRadius: '2rem' }}>
                  {/* Top-left corner */}
                  <line x1="0" y1="48" x2="0" y2="16" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="16" x2="16" y2="16" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="16" y1="16" x2="48" y2="16" stroke="#9ca3af" strokeWidth="1" />

                  {/* Top-right corner */}
                  <line x1="100%" y1="48" x2="100%" y2="16" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="100%" y1="16" x2="calc(100% - 16px)" y2="16" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="calc(100% - 16px)" y1="16" x2="calc(100% - 48px)" y2="16" stroke="#9ca3af" strokeWidth="1" />

                  {/* Bottom-left corner */}
                  <line x1="0" y1="calc(100% - 48px)" x2="0" y2="calc(100% - 16px)" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="0" y1="calc(100% - 16px)" x2="16" y2="calc(100% - 16px)" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="16" y1="calc(100% - 16px)" x2="48" y2="calc(100% - 16px)" stroke="#9ca3af" strokeWidth="1" />

                  {/* Bottom-right corner */}
                  <line x1="100%" y1="calc(100% - 48px)" x2="100%" y2="calc(100% - 16px)" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="100%" y1="calc(100% - 16px)" x2="calc(100% - 16px)" y2="calc(100% - 16px)" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="calc(100% - 16px)" y1="calc(100% - 16px)" x2="calc(100% - 48px)" y2="calc(100% - 16px)" stroke="#9ca3af" strokeWidth="1" />
                </svg>

                {/* Plus icons at corners */}
                <div className="absolute top-3 left-3 text-gray-400 text-xl font-light">+</div>
                <div className="absolute top-3 right-3 text-gray-400 text-xl font-light">+</div>
                <div className="absolute bottom-3 left-3 text-gray-400 text-xl font-light">+</div>
                <div className="absolute bottom-3 right-3 text-gray-400 text-xl font-light">+</div>

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                  {/* Build Name - Centered */}
                  <div className="flex-1 flex items-center justify-center px-4">
                    <h2 className="text-5xl font-bold text-white text-center leading-tight break-words">
                      {build.name}
                    </h2>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center mt-auto pt-6">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // Delete functionality would go here
                      }}
                      className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white p-4 rounded-xl transition-all shadow-lg"
                      title="Delete build"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                    <Link
                      href={`/builds/${build._id}`}
                      className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white p-4 rounded-xl transition-all shadow-lg"
                      title="Edit build"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                        <path d="m15 5 4 4"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
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
