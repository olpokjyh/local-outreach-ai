"use client";

import { FormEvent, useState } from "react";
import { Loader2, MapPin, MessageSquareText, Search, Store } from "lucide-react";
import type { SearchParams } from "@/types/outreach";

type SearchFormProps = {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  defaultValues?: Partial<SearchParams>;
};

const DEFAULT_TEMPLATE =
  "Hello {shop_name}! We noticed your {business_category} in {location} and would love to connect about a partnership opportunity.";

export default function SearchForm({ onSearch, isLoading, defaultValues }: SearchFormProps) {
  const [location, setLocation] = useState(defaultValues?.location ?? "Mumbai, India");
  const [businessCategory, setBusinessCategory] = useState(
    defaultValues?.businessCategory ?? "Salons"
  );
  const [radiusKm, setRadiusKm] = useState(defaultValues?.radiusKm ?? 5);
  const [messageTemplate, setMessageTemplate] = useState(
    defaultValues?.messageTemplate ?? DEFAULT_TEMPLATE
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ location, businessCategory, radiusKm, messageTemplate });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6 shadow-2xl shadow-brand-900/20"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Search Parameters</h2>
        <p className="mt-1 text-sm text-slate-400">
          Define your target area and message template to discover local shops.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label htmlFor="location" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-brand-400" />
            Search Location
          </label>
          <input
            id="location"
            type="text"
            required
            placeholder="e.g. Mumbai, India"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        <div>
          <label
            htmlFor="businessCategory"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300"
          >
            <Store className="h-3.5 w-3.5 text-brand-400" />
            Business Category
          </label>
          <input
            id="businessCategory"
            type="text"
            required
            placeholder="e.g. Salons, Bakeries, Gyms"
            value={businessCategory}
            onChange={(e) => setBusinessCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        <div>
          <label htmlFor="radius" className="mb-1.5 block text-sm font-medium text-slate-300">
            Search Radius (km)
          </label>
          <div className="flex items-center gap-4">
            <input
              id="radius"
              type="range"
              min={1}
              max={25}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-brand-500"
            />
            <input
              type="number"
              min={1}
              max={25}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Math.min(25, Math.max(1, Number(e.target.value) || 1)))}
              className="w-16 rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1.5 text-center text-sm font-semibold text-brand-300 outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="template"
            className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300"
          >
            <MessageSquareText className="h-3.5 w-3.5 text-brand-400" />
            Custom Message Template
          </label>
          <textarea
            id="template"
            required
            rows={4}
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
          />
          <p className="mt-2 text-xs text-slate-500">
            Placeholders:{" "}
            <code className="text-brand-400">{"{shop_name}"}</code>,{" "}
            <code className="text-brand-400">{"{location}"}</code>,{" "}
            <code className="text-brand-400">{"{business_category}"}</code>
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Search Shops
          </>
        )}
      </button>
    </form>
  );
}
