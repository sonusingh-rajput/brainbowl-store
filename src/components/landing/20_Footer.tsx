export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 text-center text-xs text-neutral-500">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-bold text-green-500 text-lg">BrainBowl</span>
        <span>© 2026 BrainBowl Inc. All rights reserved. • www.brainbowl.in</span>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}