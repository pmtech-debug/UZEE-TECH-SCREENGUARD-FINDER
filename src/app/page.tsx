"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";
import { createSearchEngine, searchBoxes } from "@/lib/search";
import type { Box, SearchResultItem } from "@/types/screenguard";
import { ShieldCheck, Search, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");

  // ── Fetch boxes from Supabase via API ──────────────────────────────────────
  async function loadData() {
    try {
      const res = await fetch("/api/screenguards?t=" + Date.now(), {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        setBoxes(Array.isArray(json.boxes) ? json.boxes : []);
      }
    } catch (e) {
      console.error("Failed to fetch screenguards data", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();

    // Re-fetch when tab regains focus (picks up Admin changes immediately)
    const onFocus = () => loadData();
    window.addEventListener("focus", onFocus);

    // Load recent searches from localStorage (search history only — not data)
    try {
      const saved = localStorage.getItem("uzee_recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) {}

    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // ── Save search to recent history (debounced) ──────────────────────────────
  useEffect(() => {
    if (!query.trim() || query.length < 3) return;
    const timer = setTimeout(() => {
      setRecentSearches((prev) => {
        const trimmed = query.trim();
        const filtered = prev.filter(
          (s) => s.toLowerCase() !== trimmed.toLowerCase()
        );
        const updated = [trimmed, ...filtered].slice(0, 6);
        try {
          localStorage.setItem("uzee_recent_searches", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, [query]);

  // ── Search engine ──────────────────────────────────────────────────────────
  const fuseInstance = useMemo(() => {
    if (!boxes.length) return null;
    return createSearchEngine(boxes);
  }, [boxes]);

  const results: SearchResultItem[] = useMemo(() => {
    if (!boxes.length) return [];

    if (!query.trim()) {
      let filtered = boxes;
      if (selectedBrand !== "All") {
        filtered = filtered.filter((b) =>
          b.compatibleModels.some((m) =>
            m.toLowerCase().includes(selectedBrand.toLowerCase())
          )
        );
      }
      return filtered.map((b) => ({ item: b }));
    }

    if (!fuseInstance) return [];

    let searchRes = searchBoxes(fuseInstance, query);
    if (selectedBrand !== "All") {
      searchRes = searchRes.filter((r) =>
        r.item.compatibleModels.some((m) =>
          m.toLowerCase().includes(selectedBrand.toLowerCase())
        )
      );
    }
    return searchRes;
  }, [boxes, query, fuseInstance, selectedBrand]);

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("uzee_recent_searches");
    } catch (e) {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header totalBoxes={boxes.length} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-2">
          {/* Logo Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="relative w-4 h-4">
              <Image
                src="/uzee_tech_official_logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span>Internal Inventory Search Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Find <span className="text-brand-700 dark:text-brand-500">ScreenGuard</span> Box
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Search any phone model (e.g.{" "}
            <span className="text-brand-700 dark:text-brand-400 font-semibold">Samsung A06</span>)
            to instantly find its{" "}
            <span className="font-semibold text-slate-900 dark:text-white">BOX NUMBER</span> and all
            compatible models inside.
          </p>
        </section>

        {/* Search Bar */}
        <section>
          <SearchBar
            value={query}
            onChange={setQuery}
            recentSearches={recentSearches}
            onSelectRecent={setQuery}
            onClearRecent={handleClearRecent}
          />
        </section>

        {/* Quick Brand Filter Tabs */}
        <section className="flex items-center justify-center gap-2 flex-wrap">
          {["All", "Samsung", "iPhone", "Redmi", "OPPO", "Vivo", "Realme"].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedBrand === brand
                  ? "bg-brand-700 text-white shadow-sm ring-2 ring-brand-700/30"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              {brand}
            </button>
          ))}
        </section>

        {/* Results Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {query ? `Search Results for "${query}"` : "All ScreenGuard Boxes"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300">
              {results.length}
            </span>
          </div>

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline"
            >
              Show All Boxes
            </button>
          )}
        </div>

        {/* Results List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full h-44 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 animate-pulse p-6"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching screen protector box found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Try searching with a partial model name like &quot;A06&quot;, &quot;Redmi 13&quot;, or &quot;IP 15&quot;.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery("");
                setSelectedBrand("All");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {results.map((res) => (
              <ResultCard key={res.item.id} result={res} searchQuery={query} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 UZEE TECH ScreenGuard Finder. Internal Search Tool.</p>
      </footer>
    </div>
  );
}
