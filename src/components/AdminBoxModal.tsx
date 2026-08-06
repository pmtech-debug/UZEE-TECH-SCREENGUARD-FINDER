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
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialBox) {
      setBoxNumber(initialBox.boxNumber);
      setDisplaySize(initialBox.displaySize || "Unknown");
      setTitle(initialBox.title);
      setModels([...initialBox.compatibleModels]);
    } else {
      const nextNum = existingBoxCount + 1;
      setBoxNumber(`BOX ${nextNum < 10 ? "0" + nextNum : nextNum}`);
      setDisplaySize('6.7"');
      setTitle("");
      setModels([]);
    }
    setNewModelInput("");
    setError("");
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
      id: initialBox ? initialBox.id : `box-${Date.now()}`,
      boxNumber: boxNumber.trim().toUpperCase(),
      displaySize: displaySize.trim() || "Unknown",
      title: title.trim() || currentModels.join("/"),
      compatibleModels: currentModels.length > 0 ? currentModels : [title.trim()],
      rawText: initialBox?.rawText || title.trim(),
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
                {initialBox ? `Edit ${initialBox.boxNumber}` : "Add New Compatibility Box"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Configure box number, display size, and screen protector model listings
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
