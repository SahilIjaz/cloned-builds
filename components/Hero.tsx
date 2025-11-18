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
    <div className="relative w-full h-screen flex flex-col justify-center items-center px-6 sm:px-8 md:px-12">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/bg-image-2.png)",
          filter: "md:brightness(0.4)",
        }}
      />

      <div className="relative z-10 text-white flex flex-col items-center text-center max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        {/* Glassy background container for heading and paragraph */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 border border-white/20 shadow-2xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-tight">
            <span className="text-white block">Your</span>
            <span className="text-[#7ED348]">DreamPC</span>
            <span className="text-[#7ED348]">.</span>
            {showCursor && <span className="text-[#7ED348]">|</span>}
          </h1>
          <p className="text-center font-medium text-base sm:text-lg md:text-xl lg:text-2xl w-full px-4 leading-relaxed">
            Design, customize, and build PC: Your journey to crafting the perfect
            machine starts here<span className="hidden sm:inline">.</span> Unlock the potential of your imagination with
            BuildPC, the gateway to personalized computing excellence
          </p>
        </div>

        {/* START BUILDING BUTTON */}
        <Link
          href="/builds"
          className="bg-transparent relative text-lg sm:text-xl md:text-2xl p-[1px] overflow-hidden w-full max-w-xs sm:max-w-sm"
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
            className="relative bg-[#7ED348]/[0.8] border border-slate-950 flex items-center justify-center w-full h-full text-base sm:text-lg antialiased text-white py-4 px-8 sm:py-5 sm:px-10 gap-3"
            style={{ borderRadius: "calc(0.768rem)" }}
          >
            start building
            <MoveRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </Link>
      </div>
    </div>
  );
}
