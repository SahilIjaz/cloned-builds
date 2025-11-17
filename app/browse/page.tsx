'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import BuildSelectionModal from '@/components/BuildSelectionModal';

const products = [
  {
    id: 1,
    category: 'storage',
    name: 'gamma-storage',
    price: 121,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267950/storage_lixo1y.webp',
  },
  {
    id: 2,
    category: 'fans',
    name: 'wq',
    price: 121,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268004/fans_qgjttm.webp',
  },
  {
    id: 8,
    category: 'Cpu',
    name: 'gamma-CPU',
    price: 1221,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268167/cpu_iksg0k.webp',
  },
  {
    id: 9,
    category: 'case',
    name: 'jdsjbsh',
    price: 121,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268146/case_q7lga0.webp',
    hasVR: true,
  },
  {
    id: 10,
    category: 'Cpu cooler',
    name: 'dsd',
    price: 232,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268208/cpu-cooler_onlt3r.webp',
  },
  {
    id: 7,
    category: 'memory',
    name: 'gamma-memory',
    price: 1212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267924/memory_ytll9u.webp',
  },
  {
    id: 4,
    category: 'motherboard',
    name: 'sa',
    price: 212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267899/motherboard_bthfse.webp',
  },
  {
    id: 6,
    category: 'graphics card',
    name: 'sa',
    price: 121,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267994/graphics-card_lwxkbv.webp',
  },
  {
    id: 3,
    category: 'power supply',
    name: '121',
    price: 212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268051/power-supply_pjavgq.webp',
  },
  {
    id: 5,
    category: 'network card',
    name: 'gamma-card',
    price: 212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268032/network-card_basdqx.webp',
  },
];

const categories = [
  'Case',
  'CPU',
  'Cpu cooler',
  'memory',
  'motherboard',
  'graphics card',
  'fans',
  'storage',
  'power supply',
  'network card',
  'none',
];

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState('none');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToBuild = (product: any) => {
    if (!session) {
      toast.error('Please login to add components to your build');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    setSelectedComponent(product);
    setShowModal(true);
  };

  const filteredProducts =
    selectedCategory === 'none'
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <section className="w-full flex justify-center items-start bg-slate-950 min-h-screen pb-20">
      <div className="pt-24 max-w-[1440px] w-[90%]">
        <div className="w-full flex flex-row justify-between items-start mb-12">
          <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-cyan-400 inline-block text-transparent bg-clip-text font-bold text-6xl">
            Browse
          </h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg px-6 py-3 flex items-center gap-3 text-base font-medium transition-all min-w-[140px] justify-between"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 bg-[#0a1628] border-2 border-[#1e3a8a] rounded-xl py-2 z-20 min-w-[180px] shadow-xl">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-6 py-3 text-white hover:bg-[#1e3a8a]/30 transition-colors text-base"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-black rounded-2xl border border-cyan-500/30 p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-cyan-400 text-sm font-medium mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-white text-xl font-semibold">
                    {product.name}
                  </h3>
                </div>
                <p className="text-[#7ED348] text-lg font-semibold">
                  {product.price}$
                </p>
              </div>

              <div className="w-full h-48 relative rounded-xl overflow-hidden bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToBuild(product)}
                  className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-all text-sm font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                  add to build
                </button>
                <button className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg p-2.5 transition-all">
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
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </button>
              </div>

              {product.hasVR && (
                <button className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg py-2 text-white text-sm font-medium">
                  see in vr
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedComponent && (
        <BuildSelectionModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedComponent(null);
          }}
          component={{
            category: selectedComponent.category,
            name: selectedComponent.name,
            price: selectedComponent.price,
            imageUrl: selectedComponent.imageUrl,
          }}
        />
      )}
    </section>
  );
}
