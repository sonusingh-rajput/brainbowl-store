"use client";

import Image from "next/image";
import { User, LogOut } from "lucide-react";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onOpenAuth: (mode: "login" | "register") => void;
  onLogout: () => void;
}

export default function Header({ user, onOpenAuth, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2d4739] bg-[#11241a]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-8 py-3">
        
        {/* LEFT: Logo Section */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 shrink-0">
          <div className="relative h-16 w-16 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full border border-[#d4af37]/40 bg-[#0b1711] p-1 transition group-hover:border-[#d4af37]">
            <Image
              src="/Brain Bowl Logo.png"
              alt="BrainBowl Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#f4efe6] transition group-hover:text-[#d4af37] truncate">
              BrainBowl
            </span>
            <span className="text-[8px] sm:text-[9px] font-medium tracking-wider text-[#d4af37] uppercase truncate">
              Nourish Your Brain & Body
            </span>
          </div>
        </a>

        {/* CENTER: Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm font-medium text-[#c2d1c7]">
          <a href="#benefits" className="transition hover:text-[#d4af37]">
            Benefits
          </a>
          <a href="#flavors" className="transition hover:text-[#d4af37]">
            Flavors
          </a>
          <a href="#reviews" className="transition hover:text-[#d4af37]">
            Reviews
          </a>
          <a href="#faq" className="transition hover:text-[#d4af37]">
            FAQ
          </a>
        </nav>

        {/* RIGHT: User / Auth Controls */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-[#2d4739] bg-[#0b1711] px-2.5 sm:px-3 py-1.5 transition hover:border-[#d4af37]"
              >
                <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#d4af37] text-[10px] sm:text-xs font-bold text-[#0b1711] shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#f4efe6] max-w-[70px] sm:max-w-none truncate">
                  {user.name}
                </span>
              </a>

              <button
                onClick={onLogout}
                title="Logout"
                className="flex items-center gap-1.5 rounded-lg border border-red-800/40 bg-red-950/30 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-900/40 hover:text-red-200"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 rounded-lg border border-[#2d4739] bg-[#0b1711] px-3 py-1.5 sm:py-2 text-xs font-semibold text-[#c2d1c7] transition hover:border-[#d4af37] hover:text-[#f4efe6]"
              >
                <User className="h-3.5 w-3.5 text-[#d4af37]" /> Sign In
              </button>

              <button
                onClick={() => onOpenAuth("register")}
                className="hidden sm:inline-block rounded-lg bg-[#d4af37] px-4 py-2 text-xs font-bold text-[#0b1711] shadow-md transition hover:bg-[#c39e2e]"
              >
                Register
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}