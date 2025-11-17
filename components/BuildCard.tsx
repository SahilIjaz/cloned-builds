import Link from "next/link";
import Image from "next/image";
import { Cpu, Aperture, MemoryStick, Database, MoveRight } from "lucide-react";
import { BuildCardProps } from "../types/cardTypes";

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
    <div className="flex flex-col w-[80%]">
      <div className="relative p-[4px] group">
        {/* Blurred glow effect */}
        <div
          className="absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
          style={{ backgroundSize: '400% 400%', backgroundPosition: '99.9998% 50%' }}
        ></div>

        {/* Solid border gradient */}
        <div
          className="absolute inset-0 rounded-3xl z-[1] bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
          style={{ backgroundSize: '400% 400%', backgroundPosition: '99.9998% 50%' }}
        ></div>

        {/* Inner card container */}
        <div className="relative z-10 rounded-[22px] p-4 sm:p-10 bg-zinc-900 flex gap-48 items-center">
          {/* Image Section */}
          <Image
            src={imageUrl}
            alt="specialBuilds"
            width={400}
            height={30}
            loading="lazy"
            style={{ color: 'transparent' }}
            className="object-contain rounded-lg xl:flex hidden"
          />

          {/* Content Section */}
          <div className="flex flex-col w-full justify-center items-center md:items-start">
            {/* Status and Price */}
            <div className="flex xl:items-center items-end justify-center flex-wrap-reverse sm:justify-between xl:justify-end 2xl:justify-between mb-8 flex-row-reverse xl:gap-12 w-full">
              <div className="border-mono border-b-2 text-mono text-3xl font-medium hidden sm:flex">
                {price}
              </div>
              <p className="md:text-6xl font-bold italic tsm:text-5xl text-4xl">
                {status}
              </p>
            </div>

            {/* GPU Title */}
            <div className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-semibold text-3xl text-center md:text-left">
              {gpu}
            </div>

            {/* Stats */}
            <div className="w-[80%] flex flex-col gap-4 mt-4 max-w-[460px]">
              {/* Processor */}
              <div className="flex items-center">
                <div className="rounded-full p-1 bg-white">
                  <Cpu
                    className="stroke-black"
                    width={24}
                    height={24}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="ml-2">Processor</div>
                  <div className="relative w-full h-2 bg-gray-200 rounded ml-2">
                    <div
                      className="absolute left-0 h-2 rounded bg-red-500"
                      style={{ width: processorWidth }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Graphics */}
              <div className="flex items-center">
                <div className="rounded-full p-1 bg-white">
                  <Aperture
                    className="stroke-black"
                    width={24}
                    height={24}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="ml-2">Graphics</div>
                  <div className="relative w-full h-2 bg-gray-200 rounded ml-2">
                    <div
                      className="absolute left-0 h-2 rounded bg-purple-500"
                      style={{ width: graphicsWidth }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Memory */}
              <div className="flex items-center">
                <div className="rounded-full p-1 bg-white">
                  <MemoryStick
                    className="stroke-black"
                    width={24}
                    height={24}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="ml-2">Memory</div>
                  <div className="relative w-full h-2 bg-gray-200 rounded ml-2">
                    <div
                      className="absolute left-0 h-2 rounded bg-orange-500"
                      style={{ width: memoryWidth }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Storage */}
              <div className="flex items-center">
                <div className="rounded-full p-1 bg-white">
                  <Database
                    className="stroke-black"
                    width={24}
                    height={24}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="ml-2">Storage</div>
                  <div className="relative w-full h-2 bg-gray-200 rounded ml-2">
                    <div
                      className="absolute left-0 h-2 rounded bg-yellow-500"
                      style={{ width: storageWidth }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Mobile price */}
              <div className="text-mono text-3xl w-full mb-8 mt-2 flex justify-center sm:hidden">
                <span className="border-b-2 border-mono">{price}</span>
              </div>

              {/* Button */}
              <Link className="w-full flex" href={href}>
                <button className="whitespace-nowrap rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-10 px-4 bg-blue-600 w-full mt-12 font-bold hover:opacity-80 transition-all hover:scale-95 gap-3 flex justify-center items-center py-2">
                  view build
                  <MoveRight className="w-[30px] h-[30px]" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}