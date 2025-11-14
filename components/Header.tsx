
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    // Added "bg-black" here to enable the opacity and backdrop blur
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

      <div>
        <Link
          href="/login"
          className="px-6 py-2 bg-transparent border border-[#7ED348] text-white rounded hover:bg-[#7ED348] hover:text-black transition-all"
        >
          login/signup
        </Link>
      </div>
    </div>
  );
}