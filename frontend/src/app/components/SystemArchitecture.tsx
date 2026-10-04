"use client";

export default function SystemArchitecture() {
  return (
    <section className="mt-16">

      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="text-center">

        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#138a55]">
          System Architecture
        </div>

        <h2 className="mt-2 font-serif text-3xl font-black text-[#18231c] md:text-4xl">
          PoliVerse AI Architecture
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#78827c]">
          A modular architecture connecting data collection, natural language
          processing, deep learning, database storage, and visualization.
        </p>

      </div>


      {/* =================================================
          ARCHITECTURE DIAGRAM
      ================================================= */}

      <div className="mt-10 rounded-[24px] border border-black/[0.07] bg-white/95 p-6 shadow-[0_12px_35px_rgba(40,55,45,0.055)] md:p-8">

        {/* SOURCE */}

        <ArchitectureBox
          icon="▶"
          title="YouTube Data API v3"
          description="Public political videos and comments"
          badge="DATA SOURCE"
        />


        <ArchitectureArrow />


        {/* COLLECTION */}

        <ArchitectureBox
          icon="↓"
          title="Data Collection Layer"
          description="Fetch video metadata and public comments"
          badge="COLLECTION"
        />


        <ArchitectureArrow />


        {/* PREPROCESSING */}

        <ArchitectureBox
          icon="✦"
          title="Text Preprocessing"
          description="Cleaning • Language Detection • Emoji Filtering"
          badge="PREPROCESSING"
        />


        <ArchitectureArrow />


        {/* AI LAYER */}

        <div className="grid gap-4 md:grid-cols-2">

          <ArchitectureBox
            icon="◉"
            title="RoBERTa Sentiment Model"
            description="Positive • Neutral • Negative"
            badge="DEEP LEARNING"
            highlighted
          />

          <ArchitectureBox
            icon="◆"
            title="Target-Aware Stance"
            description="Support • Oppose • Neutral • Uncertain"
            badge="STANCE ANALYSIS"
          />

        </div>


        <ArchitectureArrow />


        {/* DATABASE */}

        <ArchitectureBox
          icon="▣"
          title="PostgreSQL Database"
          description="Videos • Comments • Sentiments • Stance Results"
          badge="STORAGE"
        />


        <ArchitectureArrow />


        {/* BACKEND */}

        <ArchitectureBox
          icon="⚙"
          title="FastAPI Backend"
          description="REST APIs • Business Logic • Analytical Services"
          badge="BACKEND"
        />


        <ArchitectureArrow />


        {/* FRONTEND */}

        <ArchitectureBox
          icon="▤"
          title="Next.js Dashboard"
          description="Interactive analytics • Charts • Political insights"
          badge="PRESENTATION"
          highlighted
        />

      </div>


      {/* =================================================
          TECHNOLOGY STACK
      ================================================= */}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StackCard
          title="Frontend"
          value="Next.js + Tailwind CSS"
          icon="▤"
        />

        <StackCard
          title="Backend"
          value="Python + FastAPI"
          icon="⚙"
        />

        <StackCard
          title="Database"
          value="PostgreSQL + SQLAlchemy"
          icon="▣"
        />

        <StackCard
          title="AI / NLP"
          value="Transformers + RoBERTa"
          icon="◉"
        />

      </div>


      {/* =================================================
          ARCHITECTURE SUMMARY
      ================================================= */}

      <div className="mt-5 rounded-[20px] border border-emerald-500/10 bg-[#f1f8f3] p-5">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#138a55]">
              End-to-End Flow
            </div>

            <div className="mt-1 font-serif text-lg font-black text-[#18231c]">
              Collect → Process → Analyze → Store → Visualize
            </div>

          </div>

          <div className="rounded-full border border-[#cfe2d5] bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#456052]">
            Modular Architecture
          </div>

        </div>

      </div>

    </section>
  );
}


/* =============================================================
   ARCHITECTURE BOX
============================================================= */

function ArchitectureBox({
  icon,
  title,
  description,
  badge,
  highlighted = false,
}: {
  icon: string;
  title: string;
  description: string;
  badge: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`group rounded-[18px] border p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        highlighted
          ? "border-emerald-500/20 bg-[#f4faf6] shadow-[0_8px_25px_rgba(19,138,85,0.06)]"
          : "border-black/[0.08] bg-[#faf9f4] shadow-[0_8px_25px_rgba(40,55,45,0.035)]"
      }`}
    >

      <div className="flex items-center gap-4">

        {/* ICON */}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7f0] text-base font-black text-[#138a55] transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>


        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="text-[8px] font-black uppercase tracking-[0.18em] text-[#8a938d]">
            {badge}
          </div>

          <div className="mt-1 text-sm font-black text-[#18231c] md:text-base">
            {title}
          </div>

          <div className="mt-1 text-[10px] leading-4 text-[#78827c] md:text-xs">
            {description}
          </div>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   ARCHITECTURE ARROW
============================================================= */

function ArchitectureArrow() {
  return (
    <div className="flex h-10 items-center justify-center">

      <div className="flex flex-col items-center">

        <div className="h-5 w-px bg-[#cbdcd1]" />

        <div className="text-sm font-black text-[#138a55]">
          ↓
        </div>

      </div>

    </div>
  );
}


/* =============================================================
   TECHNOLOGY STACK CARD
============================================================= */

function StackCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white/90 p-4 shadow-[0_8px_22px_rgba(40,55,45,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf7f0] text-sm font-black text-[#138a55]">
          {icon}
        </div>

        <div className="min-w-0">

          <div className="text-[8px] font-black uppercase tracking-[0.18em] text-[#8a938d]">
            {title}
          </div>

          <div className="mt-1 text-xs font-black text-[#17211b]">
            {value}
          </div>

        </div>

      </div>

    </div>
  );
}