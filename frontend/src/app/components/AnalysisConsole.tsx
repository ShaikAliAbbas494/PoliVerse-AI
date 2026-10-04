"use client";

import { useState } from "react";
import api from "../../api/backend";

const TARGETS = [
  "Revanth Reddy",
  "KCR",
  "BJP",
  "BRS",
  "Congress",
];

type AnalysisConsoleProps = {
  target: string;
  onTargetChange: (target: string) => void;
  onAnalysisComplete: (
    data: any,
    target: string
  ) => void;
};

export default function AnalysisConsole({
  target,
  onTargetChange,
  onAnalysisComplete,
}: AnalysisConsoleProps) {

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {

    const cleanTarget = target.trim();
    const cleanUrl = youtubeUrl.trim();

    setMessage("");
    setError("");

    if (!cleanTarget) {
      setError(
        "Please enter a political leader or party."
      );
      return;
    }

    if (!cleanUrl) {
      setError(
        "Please enter a YouTube video URL."
      );
      return;
    }

    setLoading(true);

    try {

      const response = await api.post(
        "/youtube/fetch-comments",
        {
          url: cleanUrl,
          target: cleanTarget,
        }
      );

      onAnalysisComplete(
        response.data,
        cleanTarget
      );

      setMessage(
        `${response.data.total_comments} comments processed successfully.`
      );

      setYoutubeUrl("");

    } catch (err: any) {

      console.error(
        "YouTube analysis error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Unable to analyze the YouTube video."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <section className="relative z-20 mx-auto -mt-16 max-w-[1180px] px-5 md:px-8">

      <div className="overflow-hidden rounded-[22px] border border-black/10 bg-white/90 shadow-[0_20px_60px_rgba(40,60,45,0.16)] backdrop-blur-xl">

        {/* =========================================
            HEADER
        ========================================== */}

        <div className="flex flex-col justify-between gap-3 border-b border-black/10 px-6 py-5 md:flex-row md:items-center">

          <div className="flex items-center gap-3">

            <span className="h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]" />

            <div>

              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1d2821]">
                Analysis Console
              </div>

              <div className="mt-1 text-xs text-[#7a837e]">
                Analyze political content and uncover public opinion.
              </div>

            </div>

          </div>


          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1.5">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
              AI Pipeline Ready
            </span>

          </div>

        </div>


        {/* =========================================
            MAIN CONTROLS
        ========================================== */}

        <div className="grid gap-8 p-6 md:p-7 lg:grid-cols-[1.15fr_0.85fr]">

          {/* =====================================
              POLITICAL TARGET
          ====================================== */}

          <div>

            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#647069]">
              1. Political Target
            </label>


            <div className="flex flex-wrap gap-2">

              {TARGETS.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onTargetChange(item)
                  }
                  className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                    target === item
                      ? "border-[#138a55] bg-[#138a55] text-white shadow-md shadow-emerald-900/10"
                      : "border-black/10 bg-white text-[#4e5a53] hover:border-[#138a55]/40 hover:bg-emerald-50"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>


            {/* CUSTOM TARGET */}

            <div className="mt-4 flex items-center rounded-xl border border-black/10 bg-[#fafaf7] px-4">

              <span className="mr-3 whitespace-nowrap text-[10px] font-bold text-[#8a928d]">
                Custom target:
              </span>

              <input
                value={target}
                onChange={(e) =>
                  onTargetChange(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAnalyze();
                  }
                }}
                className="w-full bg-transparent py-3 text-sm font-semibold text-[#1c2821] outline-none placeholder:text-[#a3aaa5]"
                placeholder="Leader or political party..."
              />

            </div>

          </div>


          {/* =====================================
              YOUTUBE
          ====================================== */}

          <div>

            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[#647069]">
              2. YouTube Video URL
            </label>


            <div className="flex flex-col gap-3 sm:flex-row">

              <div className="flex flex-1 items-center rounded-xl border border-black/10 bg-[#fafaf7] px-4">

                <span className="mr-3 text-red-500">
                  ▶
                </span>

                <input
                  value={youtubeUrl}
                  onChange={(e) =>
                    setYoutubeUrl(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAnalyze();
                    }
                  }}
                  className="w-full bg-transparent py-3.5 text-xs text-[#1c2821] outline-none placeholder:text-[#9ca49f]"
                  placeholder="Paste YouTube video URL..."
                />

              </div>


              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="rounded-xl bg-[#138a55] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#0f7447] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <span className="flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Analyzing

                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Analyze Video
                    <span>→</span>
                  </span>
                )}

              </button>

            </div>


            {/* ===================================
                MESSAGES
            ==================================== */}

            {message && (

              <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
                ✓ {message}
              </div>

            )}

            {error && (

              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                {error}
              </div>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}