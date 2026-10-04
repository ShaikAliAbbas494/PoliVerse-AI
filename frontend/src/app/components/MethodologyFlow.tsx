"use client";

export default function MethodologyFlow() {
  return (
    <section className="mt-14">

      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="text-center">

        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#138a55]">
          Methodology
        </div>

        <h2 className="mt-2 font-serif text-3xl font-black text-[#18231c] md:text-4xl">
          How PoliVerse AI Works
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#78827c]">
          A five-stage analytical pipeline that transforms public political
          discussions into structured sentiment and target-aware insights.
        </p>

      </div>


      {/* =================================================
          FIVE-STAGE PIPELINE
      ================================================= */}

      <div className="relative mt-10">

        {/* Connecting Line */}

        <div className="absolute left-[10%] right-[10%] top-[42px] hidden h-px bg-[#d8e5dc] md:block" />

        <div className="relative grid gap-4 md:grid-cols-5">

          <MethodCard
            number="01"
            title="Collect"
            description="Collect public political comments and video information from YouTube."
            icon="↓"
          />

          <MethodCard
            number="02"
            title="Preprocess"
            description="Clean text, detect language, and identify emoji-only or unusable comments."
            icon="✦"
          />

          <MethodCard
            number="03"
            title="Understand"
            description="Use transformer-based NLP to understand the meaning and emotional signal."
            icon="◉"
          />

          <MethodCard
            number="04"
            title="Classify"
            description="Determine sentiment and target-aware political stance for the selected target."
            icon="◆"
          />

          <MethodCard
            number="05"
            title="Visualize"
            description="Convert analytical results into an interactive political intelligence dashboard."
            icon="▣"
          />

        </div>

      </div>


      {/* =================================================
          TECHNICAL INFORMATION
      ================================================= */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">

        <MethodInfo
          label="Data Source"
          value="YouTube Data API v3"
          icon="◎"
        />

        <MethodInfo
          label="Deep Learning Model"
          value="Twitter-RoBERTa Sentiment"
          icon="✦"
        />

        <MethodInfo
          label="Analysis Output"
          value="Sentiment + Political Stance"
          icon="◆"
        />

      </div>


      {/* =================================================
          PIPELINE SUMMARY
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-[20px] border border-black/[0.07] bg-white/90 shadow-[0_10px_30px_rgba(40,55,45,0.045)]">

        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#138a55]">
              Analytical Pipeline
            </div>

            <div className="mt-1 font-serif text-lg font-black text-[#18231c]">
              From raw public opinion to actionable insights
            </div>

          </div>


          <div className="flex flex-wrap items-center gap-2">

            <PipelineTag text="YouTube" />

            <span className="text-[#a5afa9]">→</span>

            <PipelineTag text="NLP" />

            <span className="text-[#a5afa9]">→</span>

            <PipelineTag text="RoBERTa" />

            <span className="text-[#a5afa9]">→</span>

            <PipelineTag text="Stance" />

            <span className="text-[#a5afa9]">→</span>

            <PipelineTag text="Dashboard" />

          </div>

        </div>

      </div>

    </section>
  );
}


/* =============================================================
   METHODOLOGY CARD
============================================================= */

function MethodCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="group relative rounded-[18px] border border-black/[0.08] bg-white/95 p-5 shadow-[0_8px_25px_rgba(40,55,45,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(40,55,45,0.08)]">

      {/* Number + Icon */}

      <div className="relative z-10 flex items-center justify-between">

        <div className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#cfe2d5] bg-[#f4faf6] px-2 text-[9px] font-black text-[#138a55]">
          {number}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf7f0] text-sm font-black text-[#138a55] transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

      </div>


      {/* Title */}

      <h3 className="mt-5 font-serif text-xl font-black text-[#18231c]">
        {title}
      </h3>


      {/* Description */}

      <p className="mt-2 text-xs leading-5 text-[#78827c]">
        {description}
      </p>


      {/* Bottom Accent */}

      <div className="mt-5 h-1 w-8 rounded-full bg-[#138a55] opacity-60 transition-all duration-300 group-hover:w-14" />

    </div>
  );
}


/* =============================================================
   TECHNICAL INFO CARD
============================================================= */

function MethodInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-black/[0.08] bg-[#faf9f4] px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf7f0] text-sm font-black text-[#138a55]">
        {icon}
      </div>

      <div className="min-w-0">

        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8a938d]">
          {label}
        </div>

        <div className="mt-1.5 truncate text-sm font-black text-[#17211b]">
          {value}
        </div>

      </div>

    </div>
  );
}


/* =============================================================
   PIPELINE TAG
============================================================= */

function PipelineTag({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-full border border-[#d7e5db] bg-[#f4faf6] px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#456052]">
      {text}
    </span>
  );
}