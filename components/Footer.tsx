import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0e1a] mt-32 py-16 md:py-20">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 flex flex-col gap-16">
        {/* First Row: Brand / Paragraph */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Build your dream PC with us!
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            Confused about what parts to buy? No worries, we've got you covered!
            Don't hesitate to visit our forum and ask our amazing community.
          </p>
        </div>

        {/* Second Row: Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#7CFF6B] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="text-gray-300 hover:text-white transition"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/builds"
                  className="text-gray-300 hover:text-white transition"
                >
                  Builds
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="text-gray-300 hover:text-white transition"
                >
                  Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold text-[#7CFF6B] mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cart"
                  className="text-gray-300 hover:text-white transition"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/user-profile"
                  className="text-gray-300 hover:text-white transition"
                >
                  User Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Extra Links (optional) */}
          <div>
            <h3 className="font-semibold text-[#7CFF6B] mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <div className="flex justify-center lg:justify-end items-start">
            <Image
              alt="Logo"
              src="/logo.png"
              width={180}
              height={180}
              className="object-contain w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44"
            />
          </div>
        </div>

        {/* Third Row: Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
            © 2024. Custom PC Builder. All rights reserved.
          </p>
          <div className="flex gap-6 sm:gap-8">
            <Link
              href="/terms"
              className="text-xs md:text-sm text-gray-400 hover:text-white transition"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-xs md:text-sm text-gray-400 hover:text-white transition"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
