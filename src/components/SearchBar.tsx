"use client";

import { useRef, useEffect } from "react";
import { Search, X, Clock, Trash2 } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  recentSearches: string[];
  onSelectRecent: (query: string) => void;
  onClearRecent: () => void;
}

export function SearchBar({
  value,
  onChange,
  recentSearches,
  onSelectRecent,
  onClearRecent,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        onChange("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onChange]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-700 dark:group-focus-within:text-brand-400 transition-colors">
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search phone model or box number... (e.g. Samsung A06, BOX 01, Redmi 13C)"
          className="w-full pl-12 sm:pl-14 pr-12 py-4 sm:py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-base sm:text-lg shadow-apple dark:shadow-apple-dark focus:outline-none focus:ring-2 focus:ring-brand-700/30 dark:focus:ring-brand-500/30 focus:border-brand-700 dark:focus:border-brand-500 transition-all duration-200"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {value ? (
          <button
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Clear search"
          >
            <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
              <X className="w-4 h-4" />
            </div>
          </button>
        ) : (
          <div className="hidden sm:flex absolute inset-y-0 right-0 pr-4 items-center pointer-events-none">
            <kbd className="px-2 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
              /
            </kbd>
          </div>
        )}
      </div>

      {/* Recent Searches Tags */}
      {recentSearches.length > 0 && !value && (
        <div className="flex items-center justify-between gap-2 px-1 text-xs text-slate-500 dark:text-slate-400 pt-1 animate-fade-in">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <span className="flex items-center gap-1 font-semibold text-slate-400 dark:text-slate-500 shrink-0">
              <Clock className="w-3.5 h-3.5" /> Recent:
            </span>
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectRecent(item)}
                className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-slate-200/50 dark:border-slate-700/50"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={onClearRecent}
            className="shrink-0 flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Clear search history"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
