import React from 'react';
import { ChevronDown, ChevronLeft, Info, PlusCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

// Sample product data - replace with actual data from your database
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
    id: 3,
    category: 'power-supply',
    name: '121',
    price: 212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268051/power-supply_pjavgq.webp',
  },
  {
    id: 4,
    category: 'motherboard',
    name: 'sa',
    price: 212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267899/motherboard_bthfse.webp',
  },
  {
    id: 5,
    category: 'network-card',
    name: 'gamma-card',
    price: 212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268032/network-card_basdqx.webp',
  },
  {
    id: 6,
    category: 'graphics-card',
    name: 'sa',
    price: 121,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267994/graphics-card_lwxkbv.webp',
  },
  {
    id: 7,
    category: 'memory',
    name: 'gamma -memory',
    price: 1212,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712267924/memory_ytll9u.webp',
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
    category: 'cpu-cooler',
    name: 'dsd',
    price: 232,
    imageUrl: 'https://res.cloudinary.com/gamma1199/image/upload/v1712268208/cpu-cooler_onlt3r.webp',
  },
];

export default function BrowsePage() {
  return (
    <section className="w-full flex justify-center items-center">
      <div className="pt-24 max-w-[1440px] w-[90%]">
        {/* Header Section */}
        <div className="w-full flex sm:flex-row-reverse flex-col-reverse sm:justify-between mb-8 justify-center items-start sm:items-start">
          {/* Filter Dropdown */}
          <button className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 py-2 flex sm:mt-3 sm:w-auto justify-center px-4 gap-3 items-center text-white w-full mt-8 sm:mt-0">
            none
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* Browse Title */}
          <div className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text font-semibold text-5xl md:text-6xl">
            Browse
          </div>
        </div>

        {/* Products Grid - 3 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              category={product.category}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              hasVR={product.hasVR}
            />
          ))}
        </div>

        {/* Pagination */}
        <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center mt-8">
          <ul className="flex flex-row items-center gap-1">
            <li>
              <a
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5"
                aria-label="Go to previous page"
                href="/browse?page=1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </a>
            </li>
            <div className="sm:flex hidden ">
              <li>
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  href="/browse?page=1"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  href="/browse?page=2"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  href="/browse?page=3"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  href="/browse?page=4"
                >
                  4
                </a>
              </li>
            </div>
            <li>
              <a
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5"
                aria-label="Go to next page"
                href="/browse?page=2"
              >
                <span>Next</span>
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
