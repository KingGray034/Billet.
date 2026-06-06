"use client";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="border-b-4 border-retro-border bg-background-light sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif font-bold text-4xl tracking-tight text-retro-border"
        >
          BILLET<span className="text-primary">.</span>
        </Link>
        <Link
          href="/dashboard"
          className="px-5 py-2 bg-primary text-white border-4 border-retro-border font-serif font-bold uppercase tracking-wider text-sm retro-button-shadow hover:bg-primary/90 transition-all"
        >
          Open Dashboard →
        </Link>
      </div>
    </nav>
  );
}

export { Navbar };