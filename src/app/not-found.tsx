
import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 text-center">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-[45%] rounded-[50%] bg-rose-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-[45%] rounded-[50%] bg-red-100/60 blur-3xl" />

      {/* Logo */}
      <Link
        href="/"
        className="absolute left-6 top-7 text-2xl font-extrabold tracking-tight text-[#250808] sm:left-12"
      >
        Pizza<span className="text-red-600">Hub</span>
      </Link>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        {/* 404 Illustration */}
        <div className="mb-8 w-full max-w-90">
          <div className="flex aspect-square items-center justify-center rounded-full bg-rose-50">
            <div className="text-8xl sm:text-9xl">
              🍕
            </div>
          </div>
        </div>

        <p className="mb-3 text-sm font-bold tracking-[0.3em] text-red-600">
          ERROR 404
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-[#250808] sm:text-6xl">
          Page Not <span className="text-red-600">Found</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-gray-500 sm:text-lg">
          Sorry, the page you are looking for `doesn&apos;t` exist
          or may have been moved.
        </p>

        {/* Home Button */}
        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-3 rounded-full bg-red-600 px-9 py-4 font-semibold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl"
        >
          <Home size={20} />
          Go Home
        </Link>
      </div>

      <p className="absolute bottom-6 text-xs text-gray-400">
        © 2026 PizzaHub. All rights reserved.
      </p>
    </main>
  );
}
