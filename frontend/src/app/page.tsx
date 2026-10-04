"use client";



import { useEffect, useState } from "react";



import api from "../api/backend";



import Navbar from "./components/Navbar";

import Hero from "./components/Hero";

import AnalysisConsole from "./components/AnalysisConsole";

import CivicPanels from "./components/CivicPanels";

import MethodologyFlow from "./components/MethodologyFlow";

import SystemArchitecture from "./components/SystemArchitecture";
import ReportButton from "./components/ReportButton";







type SentimentData = {

  target: string;

  total_analyzed: number;

  positive: number;

  neutral: number;

  negative: number;

};





type StanceData = {

  target: string;

  total_analyzed: number;

  support: number;

  oppose: number;

  neutral: number;

  uncertain: number;

  no_political_stance: number;

};





type VideoData = {

  id: number;

  youtube_video_id: string;

  title: string;

  channel_name: string;

};





export default function Home() {



  const [target, setTarget] =

    useState("Revanth Reddy");





  const [sentiment, setSentiment] =

    useState<SentimentData | null>(null);





  const [stance, setStance] =

    useState<StanceData | null>(null);





  const [video, setVideo] =

    useState<VideoData | null>(null);





  const [apiOnline, setApiOnline] =

    useState(false);





  const [loading, setLoading] =

    useState(true);





  /* =====================================================

     LOAD DASHBOARD

  ===================================================== */



  const loadDashboard = async (

    selectedTarget: string

  ) => {



    try {



      setLoading(true);





      const [

        statusResponse,

        sentimentResponse,

        stanceResponse,

      ] = await Promise.all([



        api.get("/status"),





        api.get("/sentiment/summary", {

          params: {

            target: selectedTarget,

          },

        }),





        api.get("/sentiment/stance-summary", {

          params: {

            target: selectedTarget,

          },

        }),



      ]);





      setApiOnline(

        statusResponse.data?.status ===

          "Running"

      );





      setSentiment(

        sentimentResponse.data

      );





      setStance(

        stanceResponse.data

      );



    } catch (error) {



      console.error(

        "Dashboard loading error:",

        error

      );





      setApiOnline(false);



    } finally {



      setLoading(false);



    }



  };





  /* =====================================================

     INITIAL LOAD

  ===================================================== */



  useEffect(() => {



    loadDashboard(

      "Revanth Reddy"

    );



  }, []);





  /* =====================================================

     TARGET CHANGE

  ===================================================== */



  const handleTargetChange = (

    newTarget: string

  ) => {



    setTarget(newTarget);



  };





  /* =====================================================

     ANALYSIS COMPLETE

  ===================================================== */



  const handleAnalysisComplete = async (

    data: any,

    analyzedTarget: string

  ) => {



    setTarget(analyzedTarget);





    setVideo(

      data?.video || null

    );





    await loadDashboard(

      analyzedTarget

    );



  };





  /* =====================================================

     SENTIMENT VALUES

  ===================================================== */



  const total =

    sentiment?.total_analyzed || 0;





  const positive =

    sentiment?.positive || 0;





  const neutral =

    sentiment?.neutral || 0;





  const negative =

    sentiment?.negative || 0;





  const positivePercentage =

    total > 0

      ? Math.round(

          (positive / total) * 1000

        ) / 10

      : 0;





  const neutralPercentage =

    total > 0

      ? Math.round(

          (neutral / total) * 1000

        ) / 10

      : 0;





  const negativePercentage =

    total > 0

      ? Math.round(

          (negative / total) * 1000

        ) / 10

      : 0;





  /* =====================================================

     STANCE VALUES

  ===================================================== */



  const stanceTotal =

    stance?.total_analyzed || 0;





  const support =

    stance?.support || 0;





  const oppose =

    stance?.oppose || 0;





  const stanceNeutral =

    stance?.neutral || 0;





  const uncertain =

    stance?.uncertain || 0;





  const noPoliticalStance =

    stance?.no_political_stance || 0;





  const supportPercentage =

    stanceTotal > 0

      ? Math.round(

          (support / stanceTotal) * 100

        )

      : 0;





  const opposePercentage =

    stanceTotal > 0

      ? Math.round(

          (oppose / stanceTotal) * 100

        )

      : 0;





  const stanceNeutralPercentage =

    stanceTotal > 0

      ? Math.round(

          (stanceNeutral / stanceTotal) * 100

        )

      : 0;





  const uncertainPercentage =

    stanceTotal > 0

      ? Math.round(

          (uncertain / stanceTotal) * 100

        )

      : 0;





  const noPoliticalPercentage =

    stanceTotal > 0

      ? Math.round(

          (noPoliticalStance / stanceTotal) * 100

        )

      : 0;





  return (



    <main

      id="home"

      className="min-h-screen bg-[#f5f1e8] text-[#17211b]"

    >



      {/* =================================================

          NAVBAR

      ================================================== */}



      <Navbar />





      {/* =================================================

          HERO

      ================================================== */}



      <Hero />





      {/* =================================================

          ANALYSIS CONSOLE

      ================================================== */}



      <AnalysisConsole

        target={target}



        onTargetChange={

          handleTargetChange

        }



        onAnalysisComplete={

          handleAnalysisComplete

        }

      />





      {/* =================================================

          CIVIC / CONSTITUTIONAL SIDE PANELS

      ================================================== */}



      <CivicPanels />





      {/* =================================================

          MAIN DASHBOARD

      ================================================== */}



      <section

        id="analytics"

        className="relative z-10 mx-auto max-w-[1180px] px-5 pb-20 md:px-8"

      >



        {/* =================================================

            VIDEO SOURCE

        ================================================= */}



        {video && (



          <div className="mt-6 rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">



            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">



              <div className="min-w-0">



                <div className="mb-2 flex items-center gap-2">



                  <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-red-600">

                    YouTube Source

                  </span>



                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700">

                    Analyzed

                  </span>



                </div>





                <h3 className="truncate text-sm font-black text-[#1c2821]">

                  {video.title}

                </h3>





                <p className="mt-1 text-xs text-[#78827c]">

                  {video.channel_name}

                </p>



              </div>





              <div className="rounded-xl border border-black/10 bg-[#faf9f4] px-4 py-3">



                <div className="text-[9px] font-black uppercase tracking-widest text-[#8a928d]">

                  Active Target

                </div>



                <div className="mt-1 text-sm font-black text-[#138a55]">

                  {target}

                </div>



              </div>



            </div>



          </div>



        )}





        {/* =================================================

            INTELLIGENCE OVERVIEW

        ================================================== */}



        <div className="mt-10">



          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">



            <div>



              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#138a55]">

                Intelligence Overview

              </div>



              <h2 className="mt-1 font-serif text-3xl font-black text-[#18231c] md:text-4xl">

                Political Signal Dashboard

              </h2>



            </div>





            <div className="text-left md:text-right">



              <div className="text-[9px] font-black uppercase tracking-widest text-[#8b938e]">

                Active Target

              </div>



              <div className="text-sm font-black text-[#17211b]">

                {target}

              </div>



            </div>



          </div>





          {/* =================================================

              KPI CARDS

          ================================================== */}



          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">



            <KpiCard

              label="Total Analyzed"

              value={total}

              description="Political comments processed"

              icon="●"

              background="bg-[#edf7f0]"

              iconBackground="bg-[#d5ecdc]"

              iconColor="text-[#138a55]"

            />





            <KpiCard

              label="Positive Signal"

              value={`${positivePercentage}%`}

              description={`${positive} comments`}

              icon="↗"

              background="bg-[#f0f8e9]"

              iconBackground="bg-[#dcefcf]"

              iconColor="text-[#17965a]"

            />





            <KpiCard

              label="Neutral Signal"

              value={`${neutralPercentage}%`}

              description={`${neutral} comments`}

              icon="—"

              background="bg-[#f5f1e8]"

              iconBackground="bg-[#e7dfce]"

              iconColor="text-[#747b75]"

            />





            <KpiCard

              label="Negative Signal"

              value={`${negativePercentage}%`}

              description={`${negative} comments`}

              icon="↓"

              background="bg-[#fff0ed]"

              iconBackground="bg-[#ffd8d1]"

              iconColor="text-[#e55245]"

            />



          </div>





          {/* =================================================

              ANALYTICS

          ================================================== */}



          <div

            id="insights"

            className="mt-5 grid gap-5 lg:grid-cols-2"

          >



            {/* =================================================

                SENTIMENT

            ================================================= */}



            <div className="group rounded-[20px] border border-black/[0.07] bg-white/95 p-6 shadow-[0_10px_30px_rgba(40,55,45,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(40,55,45,0.08)]">



              <div className="flex items-start justify-between">



                <div>



                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7a847d]">

                    NLP Classification

                  </div>



                  <h3 className="mt-1 font-serif text-2xl font-black text-[#18231c]">

                    Sentiment Distribution

                  </h3>



                </div>





                <div className="rounded-lg border border-emerald-500/20 bg-emerald-50 px-3 py-1.5 text-[9px] font-black text-emerald-700">

                  RoBERTa

                </div>



              </div>





              <div className="mt-8 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">



                {/* DONUT */}



                <div

                  className="relative h-48 w-48 shrink-0 rounded-full shadow-[0_8px_25px_rgba(19,138,85,0.08)]"

                  style={{

                    background: `conic-gradient(

                      #17b66b 0 ${positivePercentage}%,

                      #aeb8bc ${positivePercentage}% ${

                        positivePercentage +

                        neutralPercentage

                      }%,

                      #ef4d3f ${

                        positivePercentage +

                        neutralPercentage

                      }% 100%

                    )`,

                  }}

                >



                  <div className="absolute inset-[20px] flex flex-col items-center justify-center rounded-full bg-white">



                    <div className="text-3xl font-black text-[#17211b]">

                      {total}

                    </div>



                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[#8a938d]">

                      Comments

                    </div>



                  </div>



                </div>





                {/* LEGEND */}



                <div className="w-full max-w-[220px] space-y-4">



                  <LegendRow

                    label="Positive"

                    value={positive}

                    percentage={positivePercentage}

                    dot="bg-[#17b66b]"

                  />





                  <LegendRow

                    label="Neutral"

                    value={neutral}

                    percentage={neutralPercentage}

                    dot="bg-[#aeb8bc]"

                  />





                  <LegendRow

                    label="Negative"

                    value={negative}

                    percentage={negativePercentage}

                    dot="bg-[#ef4d3f]"

                  />



                </div>



              </div>





              <div className="mt-7 rounded-2xl border border-black/[0.07] bg-[#faf9f4] p-4 shadow-sm">



                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8b938e]">

                  Overall Interpretation

                </div>



                <div className="mt-1 text-base font-black text-[#17211b]">



                  {total === 0

                    ? "Awaiting Analysis"

                    : positive > neutral &&

                      positive > negative

                    ? "Predominantly Positive"

                    : neutral >= positive &&

                      neutral >= negative

                    ? "Predominantly Neutral"

                    : "Predominantly Negative"}



                </div>



              </div>



            </div>





            {/* =================================================

                POLITICAL STANCE

            ================================================= */}



            <div className="group rounded-[20px] border border-black/[0.07] bg-white/95 p-6 shadow-[0_10px_30px_rgba(40,55,45,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(40,55,45,0.08)]">



              <div className="flex items-start justify-between">



                <div>



                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7a847d]">

                    Target-Aware Analysis

                  </div>



                  <h3 className="mt-1 font-serif text-2xl font-black text-[#18231c]">

                    Political Stance

                  </h3>



                </div>





                <div className="rounded-lg border border-red-500/20 bg-red-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-red-600">

                  Target

                </div>



              </div>





              <div className="mt-7 space-y-5">



                <StanceRow

                  label="Support"

                  value={support}

                  percentage={supportPercentage}

                  color="bg-[#19b66d]"

                />





                <StanceRow

                  label="Oppose"

                  value={oppose}

                  percentage={opposePercentage}

                  color="bg-[#f16b5c]"

                />





                <StanceRow

                  label="Neutral"

                  value={stanceNeutral}

                  percentage={stanceNeutralPercentage}

                  color="bg-[#aeb8bc]"

                />





                <StanceRow

                  label="Uncertain"

                  value={uncertain}

                  percentage={uncertainPercentage}

                  color="bg-[#f4b72b]"

                />





                <StanceRow

                  label="No Political Stance"

                  value={noPoliticalStance}

                  percentage={noPoliticalPercentage}

                  color="bg-[#65aee4]"

                />



              </div>





              <div className="mt-7 rounded-2xl border border-emerald-500/10 bg-[#f1f8f3] p-4 shadow-sm">



                <div className="text-[9px] font-black uppercase tracking-[0.18em] text-[#138a55]">

                  Active Target

                </div>



                <div className="mt-1 text-lg font-black text-[#17211b]">

                  {target}

                </div>



                <p className="mt-1 text-xs leading-5 text-[#78827c]">

                  Stance classification is evaluated specifically

                  against the selected political target.

                </p>



              </div>



            </div>



          </div>





          {/* =================================================

              SYSTEM STATUS

          ================================================== */}



          <div className="mt-8 rounded-[18px] border border-black/[0.08] bg-white/95 p-5 shadow-[0_8px_25px_rgba(40,55,45,0.05)]">



            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">



              <div>



                <div className="flex items-center gap-2">



                  <span

                    className={`h-2.5 w-2.5 rounded-full ${

                      apiOnline

                        ? "animate-pulse bg-emerald-500"

                        : "bg-red-500"

                    }`}

                  />



                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#138a55]">



                    {apiOnline

                      ? "System Operational"

                      : "System Offline"}



                  </span>



                </div>





                <h3 className="mt-2 text-lg font-black">

                  PoliVerse Intelligence Engine

                </h3>





                <p className="mt-1 text-xs text-[#7a847e]">

                  Backend connectivity and analytical services.

                </p>



              </div>





              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">



                <StatusBox

                  label="API"

                  value={

                    apiOnline

                      ? "Running"

                      : "Offline"

                  }

                />





                <StatusBox

                  label="Database"

                  value="Connected"

                />





                <StatusBox

                  label="NLP"

                  value="Ready"

                />





                <StatusBox

                  label="Source"

                  value="YouTube"

                />



              </div>



            </div>



          </div>

          <div className="mt-4 flex justify-end">
            <ReportButton
              target={target}
              videoTitle={video?.title || "PoliVerse AI Analysis"}
              channelName={video?.channel_name || "YouTube"}
              videoUrl={
                video
                  ? `https://www.youtube.com/watch?v=${video.youtube_video_id}`
                  : ""
              }
              totalComments={total}
              positive={positive}
              neutral={neutral}
              negative={negative}
              support={support}
              oppose={oppose}
              stanceNeutral={stanceNeutral}
              uncertain={uncertain}
              noPoliticalStance={noPoliticalStance}
              modelName="Twitter-RoBERTa Sentiment"
              disabled={!video || total === 0}
            />
          </div>







          {/* =================================================

              METHODOLOGY

          ================================================== */}



          <div id="methodology">



            <MethodologyFlow />



          </div>





          {/* =================================================

              SYSTEM ARCHITECTURE

          ================================================== */}



          <SystemArchitecture />





          {/* =================================================

              FOOTER / ABOUT

          ================================================== */}



          <footer

            id="about"

            className="mt-10 border-t border-black/10 pt-6"

          >



            <div className="flex flex-col justify-between gap-3 md:flex-row">



              <div>



                <div className="text-sm font-black tracking-[0.14em]">



                  POLIVERSE{" "}



                  <span className="text-[#138a55]">

                    AI

                  </span>



                </div>





                <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#8a938d]">

                  Deep Learning Based Political Sentiment Analysis

                </div>



              </div>





              <div className="text-[9px] font-bold uppercase tracking-widest text-[#8a938d]">

                Academic Research Prototype • 2026

              </div>



            </div>



          </footer>



        </div>



      </section>



    </main>



  );

}





/* =============================================================

   KPI CARD

\============================================================= */



function KpiCard({

  label,

  value,

  description,

  icon,

  background,

  iconBackground,

  iconColor,

}: {

  label: string;

  value: string | number;

  description: string;

  icon: string;

  background: string;

  iconBackground: string;

  iconColor: string;

}) {



  return (



    <div

      className={`rounded-[18px] border border-black/[0.08] p-5 shadow-[0_8px_25px_rgba(40,55,45,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(40,55,45,0.08)] ${background}`}

    >



      <div className="flex items-center gap-3">



        <div

          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black ${iconBackground} ${iconColor}`}

        >

          {icon}

        </div>





        <div>



          <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#68736d]">

            {label}

          </div>





          <div className="mt-1 text-[30px] font-black tracking-tight text-[#17211b]">

            {value}

          </div>



        </div>



      </div>





      <div className="mt-3 text-[10px] text-[#78827c]">

        {description}

      </div>



    </div>



  );

}





/* =============================================================

   SENTIMENT LEGEND

\============================================================= */



function LegendRow({

  label,

  value,

  percentage,

  dot,

}: {

  label: string;

  value: number;

  percentage: number;

  dot: string;

}) {



  return (



    <div className="flex items-center justify-between">



      <div className="flex items-center gap-2">



        <span

          className={`h-3 w-3 rounded-full ${dot}`}

        />



        <span className="text-xs font-semibold text-[#536058]">

          {label}

        </span>



      </div>





      <div className="text-xs font-black text-[#17211b]">



        {value}



        <span className="ml-1 text-[#8a938d]">

          ({percentage}%)

        </span>



      </div>



    </div>



  );

}





/* =============================================================

   STANCE ROW

\============================================================= */



function StanceRow({

  label,

  value,

  percentage,

  color,

}: {

  label: string;

  value: number;

  percentage: number;

  color: string;

}) {



  return (



    <div>



      <div className="mb-2 flex items-center justify-between">



        <span className="text-xs font-semibold text-[#536058]">

          {label}

        </span>





        <span className="text-xs font-black text-[#17211b]">



          {value}



          <span className="ml-1 text-[#8a938d]">

            ({percentage}%)

          </span>



        </span>



      </div>





      <div className="h-3 overflow-hidden rounded-full bg-[#e9ebe7] shadow-inner">



        <div

          className={`h-full rounded-full shadow-sm transition-all duration-700 ease-out ${color}`}

          style={{

            width: `${Math.min(

              percentage,

              100

            )}%`,

          }}

        />



      </div>



    </div>



  );

}





/* =============================================================

   STATUS BOX

\============================================================= */



function StatusBox({

  label,

  value,

}: {

  label: string;

  value: string;

}) {



  return (



    <div className="rounded-xl border border-black/10 bg-[#faf9f4] px-4 py-3">



      <div className="text-[8px] font-black uppercase tracking-widest text-[#8a938d]">

        {label}

      </div>





      <div className="mt-1 text-[10px] font-black text-[#138a55]">

        {value}

      </div>



    </div>



  );

}