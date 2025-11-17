'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  // Don't render navbar on main page, forum page, and builds page
  // if (pathname === '/' || pathname === '/forum' || pathname === '/builds') {
  //   return null;
  // }

  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
              className="cursor-pointer"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`text-base font-medium transition-colors hover:text-[#7ED348] ${
                pathname === '/' ? 'text-[#7ED348]' : 'text-gray-300'
              }`}
            >
              home
            </Link>
            <Link
              href="/forum"
              className={`text-base font-medium transition-colors hover:text-[#7ED348] ${
                pathname === '/forum' ? 'text-[#7ED348]' : 'text-gray-300'
              }`}
            >
              forum
            </Link>
            <Link
              href="/builds"
              className={`text-base font-medium transition-colors hover:text-[#7ED348] ${
                pathname === '/builds' ? 'text-[#7ED348]' : 'text-gray-300'
              }`}
            >
              builds
            </Link>
            <Link
              href="/browse"
              className={`text-base font-medium transition-colors hover:text-[#7ED348] ${
                pathname === '/browse' ? 'text-[#7ED348]' : 'text-gray-300'
              }`}
            >
              browse
            </Link>
          </div>

          {/* User Profile / Login */}
          <div className="relative">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-[#7ED348] flex items-center justify-center text-black font-semibold overflow-hidden border-2 border-[#7ED348]">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                {showDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-sm font-semibold text-white">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/user-profile"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </div>
                      </Link>
                      <Link
                        href="/cart"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Cart
                        </div>
                      </Link>
                      <Link
                        href="/tracking"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                          Tracking
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign out
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 bg-transparent border-2 border-[#7ED348] text-white rounded-lg hover:bg-[#7ED348] hover:text-black transition-all font-medium text-sm"
              >
                login/signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
