import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-black">
      {/* Pizza background image (from public/asset) */}
      <Image
        src="/asset/bg image.png"
        alt="Freshly baked pizzas"
        fill
        preload
        sizes="100vw"
        className="h-80"
      />

      {/* Dark overlay so the text stays readable over the image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div
          className="max-w-2xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700"
          style={{ "--tw-animation-delay": "100ms" } as React.CSSProperties}
        >
          <span className="inline-block rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-semibold text-orange-300 ring-1 ring-orange-400/40">
            🔥 Fresh out of the oven
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza{" "}
            <span className="text-orange-400">Delivered</span> to Your Door
          </h1>

          <p className="mt-5 max-w-xl text-base text-gray-200 sm:text-lg">
            Handcrafted with premium ingredients and baked to perfection. Order
            from your favorite local vendors and get it hot at your doorstep in
            minutes.
          </p>

         <div className="mt-8">
            <Link
              href="/menu"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-8 text-sm font-medium text-white shadow-lg shadow-red-600/30 transition-colors hover:bg-red-700"
            >
              Explore Pizza Menu
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
