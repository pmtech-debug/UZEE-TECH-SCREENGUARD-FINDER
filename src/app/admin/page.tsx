"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AdminBoxModal } from "@/components/AdminBoxModal";
import type { Box } from "@/types/screenguard";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Search,
  Check,
  Smartphone,
  ShieldCheck,
  Database,
} from "lucide-react";

export default function AdminPage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Load all boxes from Supabase ───────────────────────────────────────────
  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/screenguards?t=" + Date.now(), {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        setBoxes(Array.isArray(json.boxes) ? json.boxes : []);
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ── Save a box (add or edit) via API → Supabase upsert ────────────────────
  const handleSaveModalBox = async (box: Box) => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/screenguards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upsert", box }),
      });

      if (res.ok) {
        const json = await res.json();
        // Merge the saved box back into local state
        setBoxes((prev) => {
          const idx = prev.findIndex((b) => b.id === box.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = json.box ?? box;
            return updated;
          }
          return [...prev, json.box ?? box];
        });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (e) {
      console.error("Upsert failed", e);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete a box via API → Supabase delete ─────────────────────────────────
  const handleDeleteBox = async (boxId: string) => {
    if (!confirm("Are you sure you want to delete this compatibility box?")) return;

    setDeleteId(boxId);
    try {
      const res = await fetch("/api/screenguards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: boxId }),
      });

      if (res.ok) {
        setBoxes((prev) => prev.filter((b) => b.id !== boxId));
      } else {
        alert("Delete failed. Please try again.");
      }
    } catch (e) {
      console.error("Delete failed", e);
      alert("Delete failed. Please try again.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBox(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (box: Box) => {
    setEditingBox(box);
    setIsModalOpen(true);
  };

  // ── Filtered view ─────────────────────────────────────────────────────────
  const filteredBoxes = boxes.filter((b) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      b.boxNumber.toLowerCase().includes(q) ||
      (b.displaySize && b.displaySize.toLowerCase().includes(q)) ||
      b.title.toLowerCase().includes(q) ||
      b.compatibleModels.some((m) => m.toLowerCase().includes(q))
    );
  });

  const totalModelsCount = boxes.reduce(
    (acc, b) => acc + b.compatibleModels.length,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header totalBoxes={boxes.length} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Admin Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-brand-700 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all mb-3 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-brand-700 dark:text-brand-400" />
              <span>← Back to Search</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Admin Compatibility Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Add, edit, or delete screen protector box numbers and model mappings
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Box
            </button>

            {/* Save status indicator */}
            {saveStatus === "success" && (
              <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <Check className="w-4 h-4" /> Saved to Supabase
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold text-xs">
                Save failed — check Supabase config
              </span>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Boxes
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {boxes.length}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Models Indexed
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {totalModelsCount}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Storage
              </p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Supabase PostgreSQL
              </h3>
            </div>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by box number, display size, or model name..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-700/30"
          />
        </div>

        {/* Boxes List */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-semibold">
            Loading from Supabase…
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBoxes.map((box) => (
              <div
                key={box.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-brand-700 text-white rounded-xl font-black text-sm tracking-wide">
                      {box.boxNumber}
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />
                      <span>{box.displaySize || "Unknown"}</span>
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {box.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
                    {box.compatibleModels.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                  <button
                    onClick={() => handleOpenEditModal(box)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteBox(box.id)}
                    disabled={deleteId === box.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleteId === box.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AdminBoxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModalBox}
        initialBox={editingBox}
        existingBoxCount={boxes.length}
      />
    </div>
  );
}
