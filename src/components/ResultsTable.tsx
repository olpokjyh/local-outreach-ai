"use client";

import { useMemo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Store,
} from "lucide-react";
import type { ActionStatus, BusinessResult } from "@/types/outreach";

type ResultsTableProps = {
  results: BusinessResult[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSendBatch: () => void;
  isSendingBatch: boolean;
};

function StatusBadge({ status }: { status: ActionStatus }) {
  switch (status) {
    case "sent":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Sent
        </span>
      );
    case "sending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Sending
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
          <AlertCircle className="h-3.5 w-3.5" />
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400">
          Pending
        </span>
      );
  }
}

export default function ResultsTable({
  results,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSendBatch,
  isSendingBatch,
}: ResultsTableProps) {
  const selectableIds = useMemo(
    () => results.filter((r) => r.actionStatus === "idle" || r.actionStatus === "failed").map((r) => r.id),
    [results]
  );

  const allSelectableSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-brand-900/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Search Results</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {results.length} shop{results.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={allSelectableSelected}
              onChange={onToggleSelectAll}
              disabled={selectableIds.length === 0}
              className="h-4 w-4 rounded border-white/20 bg-slate-900/60 text-brand-600 focus:ring-brand-500/40"
            />
            Select All
          </label>

          <button
            type="button"
            onClick={onSendBatch}
            disabled={!someSelected || isSendingBatch}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingBatch ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Outreach Messages
                {someSelected && (
                  <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs">
                    {selectedIds.size}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 font-medium sm:px-6">
                <span className="sr-only">Select</span>
              </th>
              <th className="px-4 py-3 font-medium sm:px-6">Shop Name</th>
              <th className="px-4 py-3 font-medium sm:px-6">Phone Number</th>
              <th className="px-4 py-3 font-medium sm:px-6">Address</th>
              <th className="px-4 py-3 font-medium sm:px-6">AI Dynamic Message</th>
              <th className="px-4 py-3 font-medium sm:px-6">Action Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((row) => {
              const isSelectable =
                row.actionStatus === "idle" || row.actionStatus === "failed";

              return (
                <tr
                  key={row.id}
                  className={`transition hover:bg-white/[0.02] ${
                    selectedIds.has(row.id) ? "bg-brand-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                      disabled={!isSelectable || isSendingBatch}
                      className="h-4 w-4 rounded border-white/20 bg-slate-900/60 text-brand-600 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-white sm:px-6">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 shrink-0 text-brand-400" />
                      {row.shopName}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-300 sm:px-6">
                    {row.phone}
                  </td>
                  <td className="max-w-[200px] px-4 py-4 text-slate-400 sm:px-6">
                    {row.address}
                  </td>
                  <td className="max-w-xs px-4 py-4 sm:px-6">
                    <p className="line-clamp-3 text-slate-300" title={row.aiMessage}>
                      {row.aiMessage}
                    </p>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={row.actionStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
