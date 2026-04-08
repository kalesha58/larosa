"use client";

import React from "react";
import Link from "next/link";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-8">
      <div className="text-center max-w-md bg-white dark:bg-zinc-900 p-12 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          Component Gallery
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          This server renders individual components for the Larosa workspace canvas.
        </p>
        
        <div className="space-y-4">
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
            Available Previews
          </p>
          <div className="flex flex-col gap-2">
            <Link 
              href="/preview/HeroSample"
              className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all"
            >
              <code className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                HeroSample
              </code>
              <span className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                →
              </span>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-zinc-400">
          Access previews directly at 
          <code className="ml-1.5 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
            /preview/ComponentName
          </code>
        </p>
      </div>
    </div>
  );
}
