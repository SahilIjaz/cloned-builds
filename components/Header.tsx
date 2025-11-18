"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { div } from "framer-motion/client";

const navItems = [
  { name: "home", path: "/" },
  { name: "forum", path: "/forum" },
  { name: "builds", path: "/builds" },
  { name: "browse", path: "/browse" },
];

const UserAvatar = ({ user, size = "md" }: { user: any; size?: "sm" | "md" }) => {
  const dimensions = size === "sm" ? 36 : 40;
  const wrapperClass = size === "sm" ? "w-9 h-9" : "w-10 h-10";

  return (
    <div className={`${wrapperClass} rounded-full bg-gray-500 text-white flex items-center justify-center overflow-hidden`}>
      {user?.image ? (
        <Image
          src={user.image}
          alt="Profile"
          width={dimensions}
          height={dimensions}
          className="rounded-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

const DropdownMenu = ({ user, onClose }: { user: any; onClose: () => void }) => (
  <>
    <div className="fixed inset-0 z-40" onClick={onClose} />
    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
      <div className="px-4 py-3 border-b border-slate-700">
        <p className="text-sm font-semibold text-white">{user?.name}</p>
        <p className="text-xs text-gray-400 truncate mt-1">{user?.email}</p>
      </div>

      {[
        { href: "/user-profile", label: "Profile" },
        { href: "/cart", label: "Cart" },
        { href: "/tracking", label: "Tracking" },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}

      <button
        onClick={() => {
          onClose();
          signOut({ callbackUrl: "/" });
        }}
        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
      >
        Sign out
      </button>
    </div>
  </>
);

const UserProfile = ({ session, showDropdown, toggleDropdown }: any) => (
  <div className="relative">
    {session ? (
      <>
        <button onClick={toggleDropdown} className="flex items-center gap-3 hover:opacity-80">
          <UserAvatar user={session.user} />
          <span className="hidden lg:block text-gray-100 text-sm">
            {session.user?.name?.toLowerCase()}
          </span>
          <svg className="hidden lg:block w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showDropdown && <DropdownMenu user={session.user} onClose={toggleDropdown} />}
      </>
    ) : (
      <Link
        href="/login"
        className="px-4 lg:px-5 py-2 border-2 border-[#7ED348] text-white rounded-lg hover:bg-[#7ED348] hover:text-black transition-all font-medium text-sm"
      >
        <span className="lg:hidden">login</span>
        <span className="hidden lg:inline">login/signup</span>
      </Link>
    )}
  </div>
);

export default function Header() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="w-full sticky top-0 z-50 bg-gradient-to-r from-[#204b62]/80 to-[#062030]/80 backdrop-blur-md border-b border-slate-700/30 shadow-md">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-28">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex-shrink-0">
            <Image src="/logo1.png" alt="logo" width={100} height={60} className="cursor-pointer" priority />
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-base font-normal transition-colors hover:text-[#7ED348] ${
                  pathname === item.path ? "text-[#7ED348]" : "text-gray-200"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <UserProfile
              session={session}
              showDropdown={showDropdown}
              toggleDropdown={() => setShowDropdown(!showDropdown)}
            />
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <UserProfile
              session={session}
              showDropdown={showDropdown}
              toggleDropdown={() => setShowDropdown(!showDropdown)}
            />

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex flex-col gap-1.5">
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-t border-slate-800 px-6 py-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-base font-medium hover:text-[#7ED348] transition-colors ${
                  pathname === item.path ? "text-[#7ED348]" : "text-gray-300"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>

 
  );
}
