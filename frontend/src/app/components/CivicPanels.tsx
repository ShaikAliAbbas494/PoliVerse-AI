"use client";

export default function CivicPanels() {
  return (
    <>
      {/* =====================================================
          LEFT INDIA PANEL
      ===================================================== */}

      <aside className="pointer-events-none absolute left-5 top-[850px] z-20 hidden xl:block 2xl:left-8">

        <div className="pointer-events-auto w-[185px] rounded-2xl border border-black/10 bg-white/90 p-4 shadow-[0_15px_45px_rgba(40,55,45,0.10)] backdrop-blur-xl">

          <div className="font-serif text-2xl font-black tracking-tight text-[#17211b]">
            INDIA
          </div>

          <div className="mt-1 text-[8px] font-black uppercase tracking-[0.22em] text-[#89918b]">
            A Nation of Ideas
          </div>

          <div className="my-4 h-px bg-black/10" />

          <div className="space-y-1.5">

            <CivicItem
              icon="⚖"
              label="Democracy"
              active
            />

            <CivicItem
              icon="♟"
              label="Development"
            />

            <CivicItem
              icon="⚖"
              label="Justice"
            />

            <CivicItem
              icon="◆"
              label="Rights"
            />

            <CivicItem
              icon="✣"
              label="Unity"
            />

            <CivicItem
              icon="◉"
              label="Opportunity"
            />

          </div>

          <div className="my-4 h-px bg-black/10" />

          <blockquote className="font-serif text-[13px] italic leading-5 text-[#59635d]">
            “Justice, liberty, equality and fraternity are not just words,
            but the soul of our democracy.”
          </blockquote>

          <div className="mt-3 text-[9px] font-bold text-[#7b847e]">
            — Dr. B. R. Ambedkar
          </div>

        </div>

      </aside>


      {/* =====================================================
          RIGHT CONSTITUTIONAL VALUES
      ===================================================== */}

      <aside className="pointer-events-none absolute right-5 top-[850px] z-20 hidden xl:block 2xl:right-8">

        <div className="pointer-events-auto w-[205px] rounded-2xl border border-black/10 bg-white/90 p-4 shadow-[0_15px_45px_rgba(40,55,45,0.10)] backdrop-blur-xl">

          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4f5a53]">
            Constitutional Values
          </div>

          <div className="mt-4 space-y-3">

            <Value
              icon="⚖"
              title="Justice"
              description="Social, Economic and Political"
              background="bg-orange-50"
              color="text-orange-600"
            />

            <Value
              icon="◆"
              title="Liberty"
              description="Thought, Expression, Belief"
              background="bg-emerald-50"
              color="text-emerald-600"
            />

            <Value
              icon="♟"
              title="Equality"
              description="Status and Opportunity"
              background="bg-purple-50"
              color="text-purple-600"
            />

            <Value
              icon="♥"
              title="Fraternity"
              description="Dignity of the Individual"
              background="bg-red-50"
              color="text-red-600"
            />

          </div>

        </div>


        {/* =================================================
            AMBEDKAR QUOTE
        ================================================== */}

        <div className="pointer-events-auto mt-4 w-[205px] rounded-2xl border border-black/10 bg-white/90 p-4 shadow-[0_15px_45px_rgba(40,55,45,0.10)] backdrop-blur-xl">

          <blockquote className="font-serif text-[13px] italic leading-5 text-[#59635d]">
            “Democracy is not just a form of government, but a way of life.”
          </blockquote>

          <div className="mt-3 text-[9px] font-bold text-[#7b847e]">
            — Dr. B. R. Ambedkar
          </div>

        </div>

      </aside>
    </>
  );
}


/* =====================================================
   LEFT CIVIC ITEM
===================================================== */

function CivicItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${
        active
          ? "bg-[#138a55] text-white shadow-sm"
          : "text-[#39453e] hover:bg-[#f4f7f3]"
      }`}
    >

      <span className="w-5 text-center text-xs">
        {icon}
      </span>

      <span className="text-[11px] font-bold">
        {label}
      </span>

    </div>
  );
}


/* =====================================================
   CONSTITUTIONAL VALUE
===================================================== */

function Value({
  icon,
  title,
  description,
  background,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  background: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${background} ${color}`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <div className="text-[11px] font-black text-[#17211b]">
          {title}
        </div>

        <div className="mt-0.5 text-[8px] leading-3 text-[#7b847e]">
          {description}
        </div>

      </div>

    </div>
  );
}