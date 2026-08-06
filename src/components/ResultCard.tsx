"use client";

import { useState } from "react";
import { Package, Copy, Check, ShieldCheck, Smartphone, Maximize2 } from "lucide-react";
import type { SearchResultItem } from "@/types/screenguard";

interface ResultCardProps {
  result: SearchResultItem;
  searchQuery?: string;
}

export function ResultCard({ result, searchQuery }: ResultCardProps) {
  const { item, matchedModel } = result;
  const [copiedBox, setCopiedBox] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyBox = () => {
    navigator.clipboard.writeText(item.boxNumber);
    setCopiedBox(true);
    setTimeout(() => setCopiedBox(false), 1800);
  };

  const handleCopyAll = () => {
    const text = `${item.boxNumber} (Display Size: ${item.displaySize || "Unknown"})\nCompatible Models:\n${item.compatibleModels.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery?.trim()) return text;
    const q = searchQuery.trim();
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.substring(0, idx)}
        <mark className="bg-amber-200 dark:bg-amber-500/40 text-slate-900 dark:text-amber-100 rounded px-1 py-0.5 font-semibold">
          {text.substring(idx, idx + q.length)}
        </mark>
        {text.substring(idx + q.length)}
      </>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-apple dark:shadow-apple-dark hover:shadow-apple-hover transition-all duration-300 relative group overflow-hidden animate-fade-in">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Box Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-700 dark:bg-brand-600 text-white rounded-2xl shadow-md shadow-brand-700/20 font-black text-lg sm:text-xl tracking-tight">
            <Package className="w-5 h-5" />
            <span>{item.boxNumber}</span>
          </div>

          {/* Display Size Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl">
            <Maximize2 className="w-4 h-4 text-brand-700 dark:text-brand-400" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block leading-tight">
                Display Size
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                {item.displaySize || "Unknown"}
              </span>
            </div>
          </div>

          {matchedModel && (
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Matched: {highlightMatch(matchedModel)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyBox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700/60"
            title="Copy Box Number"
          >
            {copiedBox ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied Box!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Box #</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors border border-brand-200/60 dark:border-brand-800/60"
            title="Copy All Compatible Models"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Models</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Raw Group Title / Summary */}
      <div className="pt-4 pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Compatibility Group Description
        </h4>
        <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/40 dark:border-slate-700/40">
          {highlightMatch(item.title)}
        </p>
      </div>

      {/* Compatible Models Grid */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            Compatible Models ({item.compatibleModels.length})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 max-h-60 overflow-y-auto pr-1">
          {item.compatibleModels.map((model, idx) => {
            const isMatched = searchQuery && model.toLowerCase().includes(searchQuery.trim().toLowerCase());
            return (
              <span
                key={idx}
                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isMatched
                    ? "bg-brand-700 text-white shadow-sm ring-2 ring-brand-700/30 scale-105"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50"
                }`}
              >
                {highlightMatch(model)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
