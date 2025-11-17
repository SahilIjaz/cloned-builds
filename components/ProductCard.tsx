'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Info, PlusCircle } from 'lucide-react';
import { ProductCardProps } from '../types/cardTypes';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import BuildSelectionModal from './BuildSelectionModal';

export default function ProductCard({
  category,
  name,
  price,
  imageUrl,
  hasVR = false,
}: ProductCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleAddToBuild = () => {
    // Check if user is logged in
    if (!session) {
      toast.error('Please login to add components to your build');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    // Open the build selection modal
    setShowModal(true);
  };

  return (
    <div
      className="flex items-center justify-center relative transition-all duration-200 ease-linear inter-var"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] relative group/card flex flex-col gap-3 hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-black border-white/[0.2] justify-between h-[450px] rounded-xl p-6 border w-full">
        {/* Header: Category and Price */}
        <div className="flex justify-between w-full gap-3">
          <div className="flex flex-col w-full  ">
            <p
              className="w-fit transition duration-200 ease-linear text-md font-extrabold text-transparent pb-4 max-w-sm mt-2 dark:text-neutral-300 bg-gradient-to-r bg-clip-text from-blue-600 via-green-500 to-indigo-400 inline-block"
              style={{
                transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
              }}
            >
              {category}
            </p>
            <div
              className="transition duration-200 ease-linear text-xl mb-4 font-bold w-full text-white"
              style={{
                transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
              }}
            >
              {name}
            </div>
          </div>
          <p
            className="w-fit transition duration-200 ease-linear text-[#7ED348] text-lg max-w-sm mt-2 dark:text-neutral-300"
            style={{
              transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
            }}
          >
            {price}$
          </p>
        </div>

        {/* Product Image */}
        <div
          className="transition duration-200 ease-linear w-full"
          style={{
            transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
          }}
        >
          <Image
            alt="thumbnail"
            loading="lazy"
            width={300}
            height={300}
            className="h-48 object-cover rounded-xl group-hover/card:shadow-xl"
            src={imageUrl}
          />
        </div>

        {/* Actions: Info Button and Add to Build */}
        <div className="flex justify-between items-center w-full gap-6 flex-row-reverse">
          <div
            className="w-fit transition duration-200 ease-linear flex"
            style={{
              transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
            }}
          >
            <button type="button">
              <Info className="w-6 h-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToBuild}
            className="transition duration-200 ease-linear items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full rounded-lg flex gap-3 flex-row-reverse"
            style={{
              transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
            }}
          >
            add to build
            <PlusCircle className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* VR Button (only for case) */}
        {hasVR && (
          <div
            className="transition duration-200 ease-linear flex w-full"
            style={{
              transform: `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`,
            }}
          >
            <button type="button" className="w-full relative flex border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible decoration-clone rounded-md">
              <div className="z-10 px-4 py-2 rounded-[inherit] bg-black w-full mb-2 justify-center text-white flex items-center">
                <span>see in vr</span>
              </div>
              <div
                className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
                style={{
                  filter: 'blur(2px)',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background:
                    'radial-gradient(17.3846% 43.5211% at 86.4439% 36.8711%, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              ></div>
              <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]"></div>
            </button>
          </div>
        )}
      </div>

      {/* Build Selection Modal */}
      <BuildSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        component={{
          category,
          name,
          price,
          imageUrl,
        }}
      />
    </div>
  );
}
