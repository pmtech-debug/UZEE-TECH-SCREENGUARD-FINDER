"use client";

import { useState } from "react";
import { Package, Copy, Check, ShieldCheck, Smartphone, Maximize2, X } from "lucide-react";
import type { SearchResultItem } from "@/types/screenguard";

interface ResultCardProps {
  result: SearchResultItem;
  searchQuery?: string;
  onStockUpdate?: () => void;
}

export function ResultCard({ result, searchQuery, onStockUpdate }: ResultCardProps) {
  const { item, matchedModel } = result;
  const [copiedBox, setCopiedBox] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockQty, setRestockQty] = useState(10);

  const [isExpanded, setIsExpanded] = useState(false);

  const stockQty = item.stockQuantity ?? 0;
  const isVerified = item.stockCountVerified ?? false;
  const stockStatus = item.stockStatus || (isVerified ? (stockQty >= 4 ? "IN_STOCK" : stockQty >= 1 ? "LOW_STOCK" : "OUT_OF_STOCK") : "NOT_COUNTED");

  const handleCopyBox = () => {
    navigator.clipboard.writeText(item.boxNumber);
    setCopiedBox(true);
    setTimeout(() => setCopiedBox(false), 1800);
  };

  const handleCopyAll = () => {
    const text = `${item.boxNumber} (Display Size: ${item.displaySize || "Unknown"})\nStock: ${stockStatus === "NOT_COUNTED" ? "NOT COUNTED" : `${stockQty} (${stockStatus.replace("_", " ")})`}\nCompatible Models:\n${item.compatibleModels.join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  const handleQuickSale = async () => {
    if (stockQty <= 0 || !isVerified) return;
    setIsUpdatingStock(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_stock",
          groupId: item.id,
          stockAction: "SALE",
          amount: 1,
        }),
      });
      if (res.ok && onStockUpdate) {
        onStockUpdate();
      }
    } catch (e) {
      console.error("Quick sale failed", e);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const confirmRestock = async () => {
    if (isNaN(restockQty) || restockQty <= 0) return;

    setIsUpdatingStock(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_stock",
          groupId: item.id,
          stockAction: "RESTOCK",
          amount: restockQty,
        }),
      });
      if (res.ok && onStockUpdate) {
        onStockUpdate();
        setIsRestockModalOpen(false);
      }
    } catch (e) {
      console.error("Quick restock failed", e);
    } finally {
      setIsUpdatingStock(false);
    }
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

  const visibleModels = isExpanded
    ? item.compatibleModels
    : item.compatibleModels.slice(0, 12);
  const remainingCount = item.compatibleModels.length - visibleModels.length;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-apple dark:shadow-apple-dark hover:shadow-apple-hover transition-all duration-300 relative group overflow-hidden animate-fade-in">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 flex-wrap">
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

          {/* Stock Badge & Quantity */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border bg-slate-50 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-tight">
                Stock
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                {stockStatus === "NOT_COUNTED" ? "Not Counted" : `${stockQty} units`}
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-wider uppercase border ${
                stockStatus === "IN_STOCK"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : stockStatus === "LOW_STOCK"
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                  : stockStatus === "NOT_COUNTED"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
              }`}
            >
              {stockStatus === "IN_STOCK"
                ? "IN STOCK"
                : stockStatus === "LOW_STOCK"
                ? "LOW STOCK"
                : stockStatus === "NOT_COUNTED"
                ? "NOT COUNTED"
                : "OUT OF STOCK"}
            </span>
          </div>

          {matchedModel && (
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Matched: {highlightMatch(matchedModel)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Quick SOLD (-1) */}
          <button
            onClick={handleQuickSale}
            disabled={isUpdatingStock || stockQty <= 0 || !isVerified}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors border ${
              stockQty > 0 && isVerified
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-rose-200 dark:border-rose-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border-slate-200 dark:border-slate-800"
            }`}
            title={!isVerified ? "Stock must be physically counted first" : stockQty <= 0 ? "Out of stock" : "Record 1 unit sold"}
          >
            SOLD (-1)
          </button>

          {/* Quick RESTOCK */}
          <button
            onClick={() => setIsRestockModalOpen(true)}
            disabled={isUpdatingStock}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-800"
            title="Restock stock quantity"
          >
            + RESTOCK
          </button>

          <button
            onClick={handleCopyBox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700/60"
            title="Copy Box Number"
          >
            {copiedBox ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Box #</span>
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
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Restock Dialog Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                RESTOCK {item.boxNumber}
              </h4>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              How many units were received?
            </p>

            {/* Quick Add Buttons */}
            <div className="flex gap-2">
              {[1, 5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRestockQty(num)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-colors ${
                    restockQty === num
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  +{num}
                </button>
              ))}
            </div>

            {/* Custom Quantity Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-center"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRestockModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRestock}
                disabled={isUpdatingStock}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Raw Group Title / Summary */}
      <div className="pt-4 pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          BOX COMPATIBILITY GROUP
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
          {item.compatibleModels.length > 12 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline"
            >
              {isExpanded ? "Show Less" : `+ ${remainingCount} more models`}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {visibleModels.map((model, idx) => {
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
