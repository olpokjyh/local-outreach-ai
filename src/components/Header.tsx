"use client";

import { MapPin, Radar, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400 ring-1 ring-brand-500/30">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Local Outreach AI
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              Discover local businesses & automate outreach
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 sm:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            Business Discovery
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI Outreach
          </span>
        </nav>
      </div>
    </header>
  );
}
