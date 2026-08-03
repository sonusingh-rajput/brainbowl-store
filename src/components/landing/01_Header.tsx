"use client";

import { User, LogOut } from "lucide-react";

interface HeaderProps {
  user: { name: string; email: string } | null;
  onOpenAuth: (mode: "login" | "register") => void;
  onLogout: () => void;
}

export default function Header({ user, onOpenAuth, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-2xl font-black text-[#22c55e] tracking-tight">
          BrainBowl
        </span>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300 font-medium">
          <a href="#benefits" className="hover:text-white transition">
            Benefits
          </a>
          <a href="#flavors" className="hover:text-white transition">
            Flavors
          </a>
          <a href="#reviews" className="hover:text-white transition">
            Reviews
          </a>
          <a href="#faq" className="hover:text-white transition">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-3 py-1.5 hover:border-[#22c55e] transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-white">
                  {user.name}
                </span>
              </a>

              <button
                onClick={onLogout}
                className="flex items-center gap-1 rounded-lg border border-red-900/40 bg-red-950/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900/30 transition"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>
          ) : (
            /* Logged-Out State: Shows Sign In & Register Buttons */
            <>
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition px-3 py-2 rounded-lg border border-[#262626] bg-[#141414]"
              >
                <User className="h-3.5 w-3.5 text-[#22c55e]" /> Sign In
              </button>

              <button
                onClick={() => onOpenAuth("register")}
                className="hidden sm:inline-block text-xs font-bold bg-[#16a34a] text-white px-4 py-2 rounded-lg hover:bg-[#15803d] transition"
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
