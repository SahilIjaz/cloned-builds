import Link from "next/link";
import Image from "next/image";
import { Cpu, Aperture, MemoryStick, Database, MoveRight } from "lucide-react";

interface BuildCardProps {
  title: string;
  price: string;
  status: "GOOD" | "BETTER" | "ULTIMATE";
  gpu: string;
  imageUrl: string;
  href: string;
  processorWidth: string;
  graphicsWidth: string;
  memoryWidth: string;
  storageWidth: string;
}

export default function BuildCard({
  title,
  price,
  status,
  gpu,
  imageUrl,
  href,
  processorWidth,
  graphicsWidth,
  memoryWidth,
  storageWidth,
}: BuildCardProps) {
  return (
    <div className="w-full max-w-[1200px] flex justify-center px-4">
      <div className="relative w-full rounded-3xl p-1 group overflow-hidden">
        {/* Gradient blur background */}
        <div
          className="absolute inset-0 rounded-3xl z-0 opacity-60 group-hover:opacity-100 blur-xl transition duration-500"
          style={{
            background:
              "radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent), radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent), radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent), radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)",
            backgroundSize: "400% 400%",
            backgroundPosition: "88% 50%",
          }}
        />
        <div
          className={`relative z-10 rounded-3xl p-6 sm:p-10 bg-zinc-900 border-2 animate-border-color flex flex-col lg:flex-row gap-8 items-center`}
        >
          <div className="lg:w-1/2 w-full flex justify-center">
            <Image
              src={imageUrl}
              alt={title}
              width={600}
              height={400}
              className="rounded-lg object-contain w-full shadow-2xl"
            />
          </div>
          <div className="lg:w-1/2 w-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 w-full">
              <h2 className="text-4xl font-bold italic text-white">{status}</h2>
              <span className="text-3xl font-bold text-[#7ED348] border-b-2 border-[#7ED348] mt-2 sm:mt-0">
                {price}
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400">
              {gpu}
            </h3>

            {/* Stats */}
            <div className="space-y-4 mb-8">
              {[
                {
                  label: "Processor",
                  icon: Cpu,
                  color: "bg-red-500",
                  width: processorWidth,
                },
                {
                  label: "Graphics",
                  icon: Aperture,
                  color: "bg-purple-500",
                  width: graphicsWidth,
                },
                {
                  label: "Memory",
                  icon: MemoryStick,
                  color: "bg-orange-500",
                  width: memoryWidth,
                },
                {
                  label: "Storage",
                  icon: Database,
                  color: "bg-yellow-500",
                  width: storageWidth,
                },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-white">
                    <stat.icon className="w-6 h-6 stroke-black" />
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="text-sm mb-1">{stat.label}</span>
                    <div className="relative w-full h-2 bg-gray-200 rounded">
                      <div
                        style={{ width: stat.width }}
                        className={`absolute left-0 h-2 rounded ${stat.color}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}
            <Link
              href={href}
              className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:opacity-90 transition-all hover:scale-95 flex items-center justify-center gap-3"
            >
              view build
              <MoveRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
