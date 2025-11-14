// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { MoveRight } from 'lucide-react';

// export default function Hero() {
//   const [text, setText] = useState('');
//   const fullText = 'Your DreamPC';
//   const [showCursor, setShowCursor] = useState(true);

//   useEffect(() => {
//     let index = 0;
//     const timer = setInterval(() => {
//       if (index <= fullText.length) {
//         setText(fullText.slice(0, index));
//         index++;
//       } else {
//         clearInterval(timer);
//       }
//     }, 100);

//     const cursorTimer = setInterval(() => {
//       setShowCursor((prev) => !prev);
//     }, 500);

//     return () => {
//       clearInterval(timer);
//       clearInterval(cursorTimer);
//     };
//   }, []);

//   return (
//     <div className="relative w-full h-screen flex flex-col justify-center items-center px-8">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: "url(/bg-image-2.png)",
//           filter: "brightness(0.4)",
//         }}
//       />

//       <div className="relative z-10 text-white flex flex-col items-center text-center">
//         <h1 className="text-5xl lg:text-6xl font-bold mb-4">
//           <span className="text-white">Your</span>{" "}
//           <span className="text-[#7ED348]">Dream PC</span>
//           {showCursor && <span className="text-[#7ED348]">|</span>}
//         </h1>
//         <p
//           className="text-center font-semibold sm:text-lg md:text-2xl xl:w-2/3 mb-8
//         mt-4"
//         >
//           Design, customize, and build PC: Your journey to crafting the perfect
//           machine starts here. Unlock the potential of your imagination with
//           BuildPC, the gateway to personalized computing excellence
//         </p>
//         <Link
//           href="/builds"
//           // className="bg-[#7ED348] text-black py-4 px-8 rounded-xl flex gap-2 items-center font-semibold hover:opacity-90 transition-all hover:scale-95"
//           className="bg-transparent relative text-xl p-[1px] overflow-hidden"
//           style="border-radius: 0.8rem;"
//         >
//           start building
//           <MoveRight className="w-6 h-6" />
//         </Link>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Hero() {
  const [text, setText] = useState("");
  const fullText = "Your DreamPC";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/bg-image-2.png)",
          filter: "brightness(0.4)",
        }}
      />

      <div className="relative z-10 text-white flex flex-col items-center text-center">
        <h1 className="text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-white">Your</span>{" "}
          <span className="text-[#7ED348]">Dream PC</span>
          {showCursor && <span className="text-[#7ED348]">|</span>}
        </h1>
        <p className="text-center font-semibold sm:text-lg md:text-2xl xl:w-2/3 mb-8 mt-4">
          Design, customize, and build PC: Your journey to crafting the perfect
          machine starts here. Unlock the potential of your imagination with
          BuildPC, the gateway to personalized computing excellence
        </p>

        {/* START BUILDING BUTTON */}
        <Link
          href="/builds"
          className="bg-transparent relative text-xl p-[1px] overflow-hidden"
          style={{ borderRadius: "0.8rem" }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ borderRadius: "calc(0.768rem)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              className="absolute h-full w-full"
              width="100%"
              height="100%"
            >
              <rect
                fill="none"
                width="100%"
                height="100%"
                rx="30%"
                ry="30%"
              ></rect>
            </svg>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "inline-block",
                transform:
                  "translateX(112.44px) translateY(0px) translateX(-50%) translateY(-50%)",
              }}
            >
              <div className="h-32 w-32 opacity-[0.8] bg-[radial-gradient(#26B170_40%,transparent_100%)]"></div>
            </div>
          </div>

          {/* Inner content */}
          <div
            className="relative bg-[#7ED348]/[0.8] border border-slate-950 flex items-center justify-center w-full h-full text-sm antialiased text-white py-4 px-8 gap-2"
            style={{ borderRadius: "calc(0.768rem)" }}
          >
            start building
            <MoveRight className="w-6 h-6" />
          </div>
        </Link>
      </div>
    </div>
  );
}
