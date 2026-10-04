"use client";

import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Home",
    target: "home",
  },
  {
    label: "Analytics",
    target: "analytics",
  },
  {
    label: "Insights",
    target: "insights",
  },
  {
    label: "Methodology",
    target: "methodology",
  },
  {
    label: "About",
    target: "about",
  },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .map((item) => {
          const element = document.getElementById(item.target);

          if (!element) {
            return null;
          }

          return {
            id: item.target,
            top: Math.abs(
              element.getBoundingClientRect().top - 130
            ),
          };
        })
        .filter(Boolean) as {
        id: string;
        top: number;
      }[];

      if (sections.length === 0) {
        return;
      }

      const closest = sections.reduce((previous, current) =>
        current.top < previous.top
          ? current
          : previous
      );

      setActive(closest.id);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const handleNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: string
  ) => {
    event.preventDefault();

    const element =
      document.getElementById(target);

    if (!element) {
      return;
    }

    const navbarOffset = 90;

    const elementPosition =
      element.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: elementPosition - navbarOffset,
      behavior: "smooth",
    });

    setActive(target);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-white/95 backdrop-blur-xl">

      <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-5 md:px-8">

        {/* =================================================
            BRAND
        ================================================= */}

        <a
          href="#home"
          onClick={(event) =>
            handleNavigation(event, "home")
          }
          className="group flex items-center gap-3"
        >

          {/* LOGO */}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">

            <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-[#138a55]">

              <div className="h-2.5 w-2.5 rounded-full border-2 border-orange-500" />

            </div>

          </div>


          {/* BRAND TEXT */}

          <div>

            <div className="text-[17px] font-black tracking-[0.12em] text-[#17211b]">
              POLIVERSE{" "}
              <span className="text-[#138a55]">
                AI
              </span>
            </div>

            <div className="mt-0.5 text-[7px] font-black uppercase tracking-[0.22em] text-[#89918b]">
              Political Intelligence Platform
            </div>

          </div>

        </a>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="hidden items-center gap-2 md:flex">

          {navItems.map((item) => {

            const isActive =
              active === item.target;

            return (
              <a
                key={item.target}
                href={`#${item.target}`}
                onClick={(event) =>
                  handleNavigation(
                    event,
                    item.target
                  )
                }
                className={`rounded-full px-5 py-2.5 text-[11px] font-black transition-all duration-300 ${
                  isActive
                    ? "bg-[#138a55] text-white shadow-[0_5px_15px_rgba(19,138,85,0.18)]"
                    : "text-[#536058] hover:bg-[#edf7f0] hover:text-[#138a55]"
                }`}
              >
                {item.label}
              </a>
            );
          })}

        </nav>


        {/* =================================================
            SYSTEM STATUS
        ================================================= */}

        <div className="hidden items-center gap-3 sm:flex">

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-700">
              System Online
            </span>

          </div>


          <div className="rounded-full border border-black/10 bg-white px-3 py-2 text-[8px] font-black text-[#8a938d]">
            v1.0
          </div>

        </div>


        {/* =================================================
            MOBILE HOME BUTTON
        ================================================= */}

        <a
          href="#home"
          onClick={(event) =>
            handleNavigation(event, "home")
          }
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf7f0] text-sm font-black text-[#138a55] md:hidden"
          aria-label="Go to home"
        >
          ↑
        </a>

      </div>

    </header>
  );
}