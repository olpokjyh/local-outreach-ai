"use client";

import { useCallback, useState } from "react";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import ResultsTable from "@/components/ResultsTable";
import { INITIAL_SAMPLE_RESULTS } from "@/lib/mock-data";
import type { BusinessResult, SearchParams } from "@/types/outreach";

export default function HomePage() {
  const [results, setResults] = useState<BusinessResult[]>(INITIAL_SAMPLE_RESULTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isSendingBatch, setIsSendingBatch] = useState(false);
  const [lastSearch, setLastSearch] = useState<SearchParams>({
    location: "Mumbai, India",
    businessCategory: "Salons",
    radiusKm: 5,
    messageTemplate:
      "Hello {shop_name}! We noticed your {business_category} in {location} and would love to connect about a partnership opportunity.",
  });

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsSearching(true);
    setSelectedIds(new Set());

    try {
      const response = await fetch("/api/search-shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.results);
      setLastSearch(params);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const selectableIds = results
      .filter((r) => r.actionStatus === "idle" || r.actionStatus === "failed")
      .map((r) => r.id);

    setSelectedIds((prev) => {
      const allSelected =
        selectableIds.length > 0 && selectableIds.every((id) => prev.has(id));

      if (allSelected) {
        return new Set();
      }

      return new Set(selectableIds);
    });
  }, [results]);

  const handleSendBatch = useCallback(async () => {
    if (selectedIds.size === 0) return;

    const targets = results.filter((r) => selectedIds.has(r.id));
    const targetIds = targets.map((r) => r.id);

    setIsSendingBatch(true);
    setResults((prev) =>
      prev.map((row) =>
        targetIds.includes(row.id) ? { ...row, actionStatus: "sending" } : row
      )
    );

    try {
      const response = await fetch("/api/send-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: targets.map((r) => ({
            id: r.id,
            shopName: r.shopName,
            phone: r.phone,
            message: r.aiMessage,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Send failed");
      }

      const data = await response.json();
      const sentSet = new Set<string>(data.sent);
      const failedSet = new Set<string>(data.failed);

      setResults((prev) =>
        prev.map((row) => {
          if (!targetIds.includes(row.id)) return row;
          if (sentSet.has(row.id)) return { ...row, actionStatus: "sent" };
          if (failedSet.has(row.id)) return { ...row, actionStatus: "failed" };
          return { ...row, actionStatus: "failed" };
        })
      );
    } catch {
      setResults((prev) =>
        prev.map((row) =>
          targetIds.includes(row.id) ? { ...row, actionStatus: "failed" } : row
        )
      );
    } finally {
      setSelectedIds(new Set());
      setIsSendingBatch(false);
    }
  }, [results, selectedIds]);

  const sentCount = results.filter((r) => r.actionStatus === "sent").length;

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <Header />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-widest text-brand-400">
                Automated Outreach
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Discover & Message Local Businesses
              </h2>
              <p className="mt-2 max-w-2xl text-slate-400">
                Search shops by location and category, preview AI-personalized messages, and
                send outreach in batches.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="glass rounded-xl px-4 py-2.5 text-center">
                <p className="text-xs text-slate-400">Found</p>
                <p className="text-xl font-bold text-white">{results.length}</p>
              </div>
              <div className="glass rounded-xl px-4 py-2.5 text-center">
                <p className="text-xs text-slate-400">Sent</p>
                <p className="text-xl font-bold text-emerald-400">{sentCount}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <SearchForm
            onSearch={handleSearch}
            isLoading={isSearching}
            defaultValues={lastSearch}
          />
          <ResultsTable
            results={results}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onSendBatch={handleSendBatch}
            isSendingBatch={isSendingBatch}
          />
        </div>
      </main>
    </div>
  );
}
