'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  // Don't render header on forum and builds pages
  if (pathname === "/forum" || pathname === "/builds") {
    return null;
  }

  return (
    <div className="fixed z-20 w-full justify-around
    items-center py-4 backdrop-blur-[126px]
    border-b bg-opacity-90
    border-b-slate-700 lg:flex hidden">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={130}
          height={230}
          className="cursor-pointer"
        />
      </Link>

      <div className="flex gap-16">
        <Link href="/" className="hover:text-mono transition-colors">
          home
        </Link>
        <Link href="/forum" className="hover:text-mono transition-colors">
          forum
        </Link>
        <Link href="/builds" className="hover:text-mono transition-colors">
          builds
        </Link>
        <Link href="/browse" className="hover:text-mono transition-colors">
          browse
        </Link>
      </div>

      <div className="relative">
        {session ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#7ED348] flex items-center justify-center text-black font-semibold overflow-hidden border-2 border-[#7ED348]">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span>{session.user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-slate-700 rounded-md shadow-lg py-1">
                <div className="px-4 py-2 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
                <Link
                  href="/user-profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-6 py-2 bg-transparent border border-[#7ED348] text-white rounded hover:bg-[#7ED348] hover:text-black transition-all"
          >
            login/signup
          </Link>
        )}
      </div>
    </div>
  );
}