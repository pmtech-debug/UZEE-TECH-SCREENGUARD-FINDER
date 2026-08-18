"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Check, Package, Smartphone } from "lucide-react";
import type { Box } from "@/types/screenguard";

interface AdminBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (box: Box) => void;
  initialBox?: Box | null;
  existingBoxCount: number;
}

export function AdminBoxModal({
  isOpen,
  onClose,
  onSave,
  initialBox,
  existingBoxCount,
}: AdminBoxModalProps) {
  const [boxNumber, setBoxNumber] = useState("");
  const [displaySize, setDisplaySize] = useState("");
  const [title, setTitle] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [newModelInput, setNewModelInput] = useState("");
  const [notes, setNotes] = useState("");
  const [source, setSource] = useState("");
  const [verification, setVerification] = useState("");
  const [error, setError] = useState("");

  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockCountVerified, setStockCountVerified] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (initialBox) {
      setBoxNumber(initialBox.boxNumber);
      setDisplaySize(initialBox.displaySize || "Unknown");
      setTitle(initialBox.title);
      setModels([...initialBox.compatibleModels]);
      setNotes(initialBox.notes || "");
      setSource(initialBox.source || "");
      setVerification(initialBox.verification || "");
      setStockQuantity(initialBox.stockQuantity ?? 0);
      setStockCountVerified(initialBox.stockCountVerified ?? false);

      // Load history for this group
      fetch(`/api/inventory?type=history&groupId=${initialBox.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (Array.isArray(json.history)) setHistoryList(json.history);
        })
        .catch(() => {});
    } else {
      const nextNum = existingBoxCount + 1;
      setBoxNumber(`BOX ${nextNum < 10 ? "0" + nextNum : nextNum}`);
      setDisplaySize("Unknown");
      setTitle("");
      setModels([]);
      setNotes("");
      setSource("");
      setVerification("");
      setStockQuantity(0);
      setStockCountVerified(false);
      setHistoryList([]);
    }
    setNewModelInput("");
    setError("");
    setShowHistory(false);
  }, [initialBox, existingBoxCount, isOpen]);

  if (!isOpen) return null;

  const handleAddModel = () => {
    if (!newModelInput.trim()) return;
    
    // Support bulk add via slash or comma or newline
    const items = newModelInput
      .split(/[\/\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updated = [...models];
    for (const item of items) {
      if (!updated.includes(item)) {
        updated.push(item);
      }
    }

    setModels(updated);
    setNewModelInput("");
  };

  const handleRemoveModel = (index: number) => {
    setModels(models.filter((_, i) => i !== index));
  };

  const handleStockAction = async (actionType: "SALE" | "RESTOCK" | "ADJUSTMENT") => {
    if (!initialBox) return;
    let amount = 1;

    if (actionType === "RESTOCK") {
      const input = window.prompt(`Restock quantity for ${boxNumber}:`, "10");
      if (!input) return;
      amount = parseInt(input, 10);
      if (isNaN(amount) || amount <= 0) return;
    } else if (actionType === "ADJUSTMENT") {
      const input = window.prompt(`Set exact physical count for ${boxNumber}:`, String(stockQuantity));
      if (!input) return;
      amount = parseInt(input, 10);
      if (isNaN(amount) || amount < 0) return;
    }

    setIsActionLoading(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_stock",
          groupId: initialBox.id,
          stockAction: actionType,
          amount,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.box) {
          setStockQuantity(json.box.stockQuantity);
          setStockCountVerified(true);
        }
        // Refresh history
        const hRes = await fetch(`/api/inventory?type=history&groupId=${initialBox.id}`);
        const hJson = await hRes.json();
        if (Array.isArray(hJson.history)) setHistoryList(hJson.history);
      }
    } catch (e) {
      console.error("Stock action failed", e);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddToPurchaseList = async () => {
    if (!initialBox) return;
    const input = window.prompt(`Order quantity for ${boxNumber}:`, "10");
    if (!input) return;
    const qty = parseInt(input, 10);
    if (isNaN(qty) || qty <= 0) return;

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_purchase_item",
          groupId: initialBox.id,
          requestedQuantity: qty,
          note: "Added from Admin Box Modal",
        }),
      });
      if (res.ok) {
        alert(`Added ${boxNumber} (${qty} units) to Purchase List!`);
      }
    } catch (e) {
      console.error("Add to purchase list failed", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let currentModels = [...models];
    if (newModelInput.trim()) {
      const items = newModelInput
        .split(/[\/\n,]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      for (const item of items) {
        if (!currentModels.includes(item)) {
          currentModels.push(item);
        }
      }
    }

    if (!boxNumber.trim()) {
      setError("Box Number is required");
      return;
    }
    if (!title.trim() && currentModels.length === 0) {
      setError("Please provide a title or add at least one compatible model");
      return;
    }

    const finalBox: Box = {
      id: initialBox ? initialBox.id : `SD-NEW-${Date.now()}`,
      boxNumber: boxNumber.trim().toUpperCase(),
      displaySize: displaySize.trim() || "Unknown",
      title: title.trim() || currentModels.join("/"),
      compatibleModels: currentModels.length > 0 ? currentModels : [title.trim()],
      rawText: initialBox?.rawText || title.trim(),
      category: initialBox?.category || "Super-D",
      notes: notes.trim() || undefined,
      source: source.trim() || undefined,
      verification: verification.trim() || undefined,
      stockQuantity,
      stockCountVerified,
    };

    onSave(finalBox);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-700 text-white font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialBox ? `Edit ${initialBox.boxNumber} (${initialBox.id})` : "Add New Compatibility Box"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Configure box number, stock quantity, display size, and model listings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Inventory Controls Card */}
          {initialBox && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Inventory Controls
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {stockQuantity} units
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${
                        stockQuantity >= 4
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : stockQuantity >= 1
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {stockQuantity >= 4 ? "IN STOCK" : stockQuantity >= 1 ? "LOW STOCK" : "OUT OF STOCK"}
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={stockCountVerified}
                    onChange={(e) => setStockCountVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700"
                  />
                  <span>Physical Count Verified</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => handleStockAction("SALE")}
                  disabled={isActionLoading || stockQuantity <= 0}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors disabled:opacity-50"
                >
                  - Deduct Stock (Sold -1)
                </button>
                <button
                  type="button"
                  onClick={() => handleStockAction("RESTOCK")}
                  disabled={isActionLoading}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  + Add Stock (Restock)
                </button>
                <button
                  type="button"
                  onClick={() => handleStockAction("ADJUSTMENT")}
                  disabled={isActionLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  Set Quantity
                </button>
                <button
                  type="button"
                  onClick={handleAddToPurchaseList}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs border border-brand-200 dark:border-brand-800 hover:bg-brand-100 transition-colors"
                >
                  Add to Purchase List
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  {showHistory ? "Hide History" : `History (${historyList.length})`}
                </button>
              </div>

              {/* History Log Drawer */}
              {showHistory && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Recent Inventory History
                  </span>
                  {historyList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No inventory transactions logged yet.</p>
                  ) : (
                    historyList.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {t.transactionType}: {t.previousQuantity} → {t.newQuantity} ({t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange})
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* New Box Initial Stock Setup */}
          {!initialBox && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Initial Stock Setup
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                      setStockQuantity(val);
                      if (val > 0) {
                        setStockCountVerified(true);
                      }
                    }}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                  />
                </div>
                <div className="flex items-center pt-2 sm:pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={stockCountVerified}
                      onChange={(e) => setStockCountVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700"
                    />
                    <span>Physical stock count verified</span>
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                New boxes remain <span className="font-bold">NOT COUNTED</span> unless physical stock count is verified.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Box Number
              </label>
              <input
                type="text"
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value)}
                placeholder="e.g. BOX 01, BOX 107"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-brand-700/30"
                required
              />
            </div>

            {/* Display Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Display Size
              </label>
              <input
                type="text"
                value={displaySize}
                onChange={(e) => setDisplaySize(e.target.value)}
                placeholder='e.g. 6.7", 6.1", Unknown'
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-brand-700/30"
              />
            </div>
          </div>

          {/* Box Group Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Box Title / Raw Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SAM A05/A06 4G/A06 5G/REDMI 13C"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
            />
          </div>

          {/* Compatible Models List Manager */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                Compatible Models ({models.length})
              </span>
              <span className="text-[11px] text-slate-400 font-normal lowercase">
                (bulk paste separated by / or newlines)
              </span>
            </label>

            {/* Input & Add Button */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newModelInput}
                onChange={(e) => setNewModelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddModel();
                  }
                }}
                placeholder="Type model name (e.g. Samsung A06 5G) and press Add"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/30"
              />
              <button
                type="button"
                onClick={handleAddModel}
                className="px-4 py-2.5 rounded-xl bg-brand-700 text-white font-semibold text-sm hover:bg-brand-800 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Models Tag Cloud */}
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              {models.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2 w-full text-center">
                  No compatible models added yet.
                </p>
              ) : (
                models.map((model, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
                  >
                    <span>{model}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveModel(idx)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove model"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
