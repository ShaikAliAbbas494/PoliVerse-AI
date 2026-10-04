"use client";

import { useState } from "react";
import jsPDF from "jspdf";

type ReportButtonProps = {
  target: string;
  videoTitle: string;
  channelName: string;
  videoUrl: string;
  totalComments: number;

  positive: number;
  neutral: number;
  negative: number;

  support: number;
  oppose: number;
  stanceNeutral: number;
  uncertain: number;
  noPoliticalStance: number;

  modelName?: string;
  disabled?: boolean;
};

/* ============================================================
   UNICODE / TELUGU FONT SUPPORT
============================================================ */

let teluguFontPromise: Promise<void> | null = null;

async function loadTeluguFont(): Promise<void> {
  if (teluguFontPromise) {
    return teluguFontPromise;
  }

  teluguFontPromise = new Promise<void>(async (resolve, reject) => {
    try {
      const existingFont = Array.from(
        document.fonts
      ).find(
        (font) =>
          font.family === "Noto Sans Telugu" &&
          font.status === "loaded"
      );

      if (existingFont) {
        resolve();
        return;
      }

      const font = new FontFace(
        "Noto Sans Telugu",
        'url("/fonts/NotoSansTelugu-Regular.ttf") format("truetype")'
      );

      await font.load();

      document.fonts.add(font);

      await document.fonts.load(
        '16px "Noto Sans Telugu"'
      );

      resolve();
    } catch (error) {
      console.error(
        "Failed to load Noto Sans Telugu font:",
        error
      );

      reject(error);
    }
  });

  return teluguFontPromise;
}

/* ============================================================
   CHECK FOR NON-ASCII / UNICODE TEXT
============================================================ */

function containsUnicode(text: string): boolean {
  return /[^\u0000-\u007F]/.test(text);
}

/* ============================================================
   RENDER UNICODE TEXT USING BROWSER FONT ENGINE
   This is important for Telugu because the browser correctly
   performs complex-script shaping.
============================================================ */

async function createUnicodeTextImage(
  text: string,
  fontSize: number,
  maxWidthPx: number,
  fontWeight = 700
): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
  await loadTeluguFont();

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  const fontFamily =
    '"Noto Sans Telugu", "Noto Sans", Arial, sans-serif';

  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  const words = text.split(/\s+/);
  const lines: string[] = [];

  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    const width = context.measureText(testLine).width;

    if (
      width > maxWidthPx &&
      currentLine
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  if (lines.length === 0) {
    lines.push("");
  }

  const lineHeight = Math.ceil(
    fontSize * 1.45
  );

  const padding = 8;

  let measuredWidth = 0;

  for (const line of lines) {
    measuredWidth = Math.max(
      measuredWidth,
      context.measureText(line).width
    );
  }

  const canvasWidth = Math.min(
    Math.ceil(measuredWidth + padding * 2),
    Math.ceil(maxWidthPx + padding * 2)
  );

  const canvasHeight =
    lines.length * lineHeight +
    padding * 2;

  canvas.width = canvasWidth * 2;
  canvas.height = canvasHeight * 2;

  context.scale(2, 2);

  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.fillStyle = "#17211B";
  context.textBaseline = "top";

  lines.forEach((line, index) => {
    context.fillText(
      line,
      padding,
      padding + index * lineHeight
    );
  });

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: canvasWidth,
    height: canvasHeight,
  };
}

/* ============================================================
   COMPONENT
============================================================ */

export default function ReportButton({
  target,
  videoTitle,
  channelName,
  videoUrl,
  totalComments,

  positive,
  neutral,
  negative,

  support,
  oppose,
  stanceNeutral,
  uncertain,
  noPoliticalStance,

  modelName = "Twitter-RoBERTa Sentiment",
  disabled = false,
}: ReportButtonProps) {
  const [generating, setGenerating] =
    useState(false);

  const generateReport = async () => {
    if (generating || disabled) {
      return;
    }

    try {
      setGenerating(true);

      /*
       * Load the Telugu font before creating the PDF.
       * The browser handles Telugu shaping correctly.
       */
      if (
        containsUnicode(videoTitle) ||
        containsUnicode(channelName) ||
        containsUnicode(target)
      ) {
        await loadTeluguFont();
      }

      const doc = new jsPDF();

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      const green = "#138A55";
      const dark = "#17211B";
      const muted = "#68736C";
      const lightGreen = "#EDF7F0";
      const border = "#D9E4DC";

      /* ======================================================
         HELPERS
      ====================================================== */

      const percentage = (value: number) => {
        if (!totalComments) {
          return "0.0";
        }

        return (
          (value / totalComments) *
          100
        ).toFixed(1);
      };

      const addFooter = () => {
        doc.setDrawColor(border);

        doc.line(
          18,
          pageHeight - 18,
          pageWidth - 18,
          pageHeight - 18
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(muted);

        doc.text(
          "PoliVerse AI • Political Sentiment & Public Opinion Analytics",
          18,
          pageHeight - 10
        );

        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth - 18,
          pageHeight - 10,
          {
            align: "right",
          }
        );
      };

      const addSectionTitle = (
        title: string,
        y: number
      ) => {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(13);
        doc.setTextColor(green);

        doc.text(
          title,
          18,
          y
        );

        doc.setDrawColor(border);

        doc.line(
          18,
          y + 4,
          pageWidth - 18,
          y + 4
        );

        return y + 14;
      };

      /* ======================================================
         HEADER
      ====================================================== */

      doc.setFillColor(green);

      doc.rect(
        0,
        0,
        pageWidth,
        42,
        "F"
      );

      doc.setTextColor("#FFFFFF");

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(22);

      doc.text(
        "POLIVERSE AI",
        18,
        18
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.text(
        "Political Sentiment & Public Opinion Analytics",
        18,
        27
      );

      doc.setFontSize(8);

      doc.text(
        "ANALYSIS REPORT",
        pageWidth - 18,
        18,
        {
          align: "right",
        }
      );

      doc.text(
        new Date().toLocaleDateString(
          "en-IN"
        ),
        pageWidth - 18,
        27,
        {
          align: "right",
        }
      );

      /* ======================================================
         TITLE
      ====================================================== */

      let y = 57;

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(16);

      doc.setTextColor(dark);

      doc.text(
        "Political Opinion Analysis Report",
        18,
        y
      );

      y += 10;

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.setTextColor(muted);

      doc.text(
        "Generated from the selected YouTube analysis session.",
        18,
        y
      );

      y += 14;

      /* ======================================================
         TARGET CARD
      ====================================================== */

      doc.setFillColor(lightGreen);

      doc.roundedRect(
        18,
        y,
        pageWidth - 36,
        39,
        4,
        4,
        "F"
      );

      doc.setFontSize(8);

      doc.setTextColor(muted);

      doc.text(
        "ANALYSIS TARGET",
        25,
        y + 10
      );

      /*
       * Target normally contains English.
       * If Telugu is ever selected, render it using the
       * browser's Unicode engine.
       */

      if (containsUnicode(target)) {
        const targetImage =
          await createUnicodeTextImage(
            target,
            13,
            130,
            700
          );

        const targetWidth =
          Math.min(
            targetImage.width * 0.26,
            95
          );

        const targetHeight =
          targetImage.height * 0.26;

        doc.addImage(
          targetImage.dataUrl,
          "PNG",
          25,
          y + 13,
          targetWidth,
          targetHeight
        );
      } else {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(13);

        doc.setTextColor(dark);

        doc.text(
          target || "Not specified",
          25,
          y + 20
        );
      }

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(8);

      doc.setTextColor(muted);

      doc.text(
        `Total comments analyzed: ${totalComments}`,
        25,
        y + 30
      );

      y += 52;

      /* ======================================================
         SOURCE INFORMATION
      ====================================================== */

      y = addSectionTitle(
        "Source Information",
        y
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.setTextColor(dark);

      doc.text(
        "Video",
        18,
        y
      );

      /*
       * IMPORTANT:
       * Telugu video titles are rendered as an image.
       * This uses Chrome/Edge's proper Telugu shaping
       * instead of jsPDF's basic glyph mapping.
       */

      if (
        videoTitle &&
        containsUnicode(videoTitle)
      ) {
        const titleImage =
          await createUnicodeTextImage(
            videoTitle,
            10,
            125,
            700
          );

        const maxImageWidth = 125;

        const imageScale = Math.min(
          maxImageWidth /
            titleImage.width,
          1
        );

        const imageWidth =
          titleImage.width *
          imageScale;

        const imageHeight =
          titleImage.height *
          imageScale;

        doc.addImage(
          titleImage.dataUrl,
          "PNG",
          55,
          y - 6,
          imageWidth,
          imageHeight
        );

        y += Math.max(
          12,
          imageHeight + 2
        );
      } else {
        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setTextColor(muted);

        const titleLines =
          doc.splitTextToSize(
            videoTitle ||
              "YouTube Video",
            pageWidth - 55
          );

        doc.text(
          titleLines,
          55,
          y
        );

        y += Math.max(
          8,
          titleLines.length * 5
        );
      }

      /* ======================================================
         CHANNEL
      ====================================================== */

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(dark);

      doc.text(
        "Channel",
        18,
        y
      );

      if (
        channelName &&
        containsUnicode(channelName)
      ) {
        const channelImage =
          await createUnicodeTextImage(
            channelName,
            9,
            125,
            400
          );

        const maxImageWidth = 125;

        const imageScale = Math.min(
          maxImageWidth /
            channelImage.width,
          1
        );

        const imageWidth =
          channelImage.width *
          imageScale;

        const imageHeight =
          channelImage.height *
          imageScale;

        doc.addImage(
          channelImage.dataUrl,
          "PNG",
          55,
          y - 6,
          imageWidth,
          imageHeight
        );

        y += Math.max(
          10,
          imageHeight
        );
      } else {
        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.setTextColor(muted);

        doc.text(
          channelName || "Unknown",
          55,
          y
        );

        y += 7;
      }

      /* ======================================================
         URL
      ====================================================== */

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setTextColor(dark);

      doc.text(
        "Source URL",
        18,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(muted);

      const urlLines =
        doc.splitTextToSize(
          videoUrl ||
            "Not available",
          pageWidth - 55
        );

      doc.text(
        urlLines,
        55,
        y
      );

      y += Math.max(
        10,
        urlLines.length * 5
      );

      /* ======================================================
         SENTIMENT DISTRIBUTION
      ====================================================== */

      y = addSectionTitle(
        "Sentiment Distribution",
        y
      );

      const sentimentCards = [
        {
          label: "Positive",
          value: positive,
          percent: percentage(
            positive
          ),
        },
        {
          label: "Neutral",
          value: neutral,
          percent: percentage(
            neutral
          ),
        },
        {
          label: "Negative",
          value: negative,
          percent: percentage(
            negative
          ),
        },
      ];

      const cardWidth =
        (pageWidth - 48) / 3;

      sentimentCards.forEach(
        (item, index) => {
          const x =
            18 +
            index *
              (cardWidth + 6);

          doc.setFillColor(
            "#FAFBF9"
          );

          doc.roundedRect(
            x,
            y,
            cardWidth,
            32,
            4,
            4,
            "F"
          );

          doc.setFont(
            "helvetica",
            "bold"
          );

          doc.setFontSize(9);

          doc.setTextColor(dark);

          doc.text(
            item.label,
            x + 6,
            y + 9
          );

          doc.setFontSize(17);

          doc.text(
            String(item.value),
            x + 6,
            y + 21
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setFontSize(7);

          doc.setTextColor(muted);

          doc.text(
            `${item.percent}% of comments`,
            x + 6,
            y + 27
          );
        }
      );

      y += 44;

     /* ======================================================
   STANCE
====================================================== */

/*
 * Keep the complete stance section together.
 * If there is not enough room on the current page,
 * move the entire section to the next page.
 */

const stanceSectionHeight = 82;

if (y + stanceSectionHeight > pageHeight - 25) {
  addFooter();
  doc.addPage();
  y = 25;
}

y = addSectionTitle(
  "Target-Aware Political Stance",
  y
);

      const stanceRows = [
        ["Support", support],
        ["Oppose", oppose],
        ["Neutral", stanceNeutral],
        ["Uncertain", uncertain],
        [
          "No Political Stance",
          noPoliticalStance,
        ],
      ];

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(9);

      doc.setTextColor(dark);

      doc.text(
        "Stance",
        22,
        y
      );

      doc.text(
        "Comments",
        105,
        y
      );

      doc.text(
        "Percentage",
        145,
        y
      );

      y += 6;

      doc.setDrawColor(border);

      doc.line(
        18,
        y,
        pageWidth - 18,
        y
      );

      y += 8;

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      stanceRows.forEach(
        ([label, value]) => {
          doc.setTextColor(dark);

          doc.text(
            String(label),
            22,
            y
          );

          doc.setTextColor(muted);

          doc.text(
            String(value),
            105,
            y
          );

          doc.text(
            `${percentage(
              Number(value)
            )}%`,
            145,
            y
          );

          y += 8;

          doc.setDrawColor(
            "#EEF2EF"
          );

          doc.line(
            18,
            y - 4,
            pageWidth - 18,
            y - 4
          );
        }
      );

      y += 8;

      /* ======================================================
         ANALYSIS CONFIGURATION
      ====================================================== */

      y = addSectionTitle(
        "Analysis Configuration",
        y
      );

      const config = [
        [
          "Deep Learning Model",
          modelName,
        ],
        [
          "Analysis Target",
          target,
        ],
        [
          "Data Source",
          "YouTube Data API v3",
        ],
        [
          "Analysis Type",
          "Sentiment + Target-Aware Political Stance",
        ],
      ];

      for (
        const [label, value] of config
      ) {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.setFontSize(8);

        doc.setTextColor(dark);

        doc.text(
          label,
          18,
          y
        );

        /*
         * If the configuration value ever contains
         * Telugu, render it using the Unicode renderer.
         */
        if (
          containsUnicode(value)
        ) {
          const configImage =
            await createUnicodeTextImage(
              value,
              8,
              115,
              400
            );

          const scale =
            Math.min(
              115 /
                configImage.width,
              1
            );

          doc.addImage(
            configImage.dataUrl,
            "PNG",
            75,
            y - 5,
            configImage.width *
              scale,
            configImage.height *
              scale
          );

          y += Math.max(
            7,
            configImage.height *
              scale
          );
        } else {
          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.setTextColor(muted);

          const valueLines =
            doc.splitTextToSize(
              value,
              pageWidth - 75
            );

          doc.text(
            valueLines,
            75,
            y
          );

          y += Math.max(
            7,
            valueLines.length * 5
          );
        }
      }

      /* ======================================================
         PAGE BREAK
      ====================================================== */

      if (
        y >
        pageHeight - 70
      ) {
        addFooter();

        doc.addPage();

        y = 25;
      }

      y += 8;

      /* ======================================================
         ANALYSIS SUMMARY
      ====================================================== */

      y = addSectionTitle(
        "Analysis Summary",
        y
      );

      const dominantSentiment =
        positive >= negative &&
        positive >= neutral
          ? "Positive"
          : negative >= positive &&
            negative >= neutral
          ? "Negative"
          : "Neutral";

      const dominantStance =
        support >= oppose &&
        support >= stanceNeutral &&
        support >= uncertain &&
        support >= noPoliticalStance
          ? "Support"
          : oppose >= support &&
            oppose >= stanceNeutral &&
            oppose >= uncertain &&
            oppose >= noPoliticalStance
          ? "Oppose"
          : stanceNeutral >= uncertain &&
            stanceNeutral >= noPoliticalStance
          ? "Neutral"
          : uncertain >=
              noPoliticalStance
          ? "Uncertain"
          : "No Political Stance";

      const summaryText =
        `The analysis examined ${totalComments} public YouTube comments ` +
        `for the selected target "${target}". The dominant overall sentiment ` +
        `was ${dominantSentiment}, while the most frequent target-aware stance ` +
        `classification was ${dominantStance}. These results represent ` +
        `automated analytical classifications of the collected public comments.`;

      doc.setFillColor(
        "#FAFBF9"
      );

      doc.roundedRect(
        18,
        y,
        pageWidth - 36,
        42,
        4,
        4,
        "F"
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(9);

      doc.setTextColor(muted);

      const summaryLines =
        doc.splitTextToSize(
          summaryText,
          pageWidth - 50
        );

      doc.text(
        summaryLines,
        25,
        y + 10,
        {
          lineHeightFactor: 1.5,
        }
      );

      y += 54;

      

      /* ======================================================
         ANALYTICAL NOTICE
      ====================================================== */

      doc.setFillColor(
        "#FFF9ED"
      );

      doc.roundedRect(
        18,
        y,
        pageWidth - 36,
        28,
        4,
        4,
        "F"
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(8);

      doc.setTextColor(dark);

      doc.text(
        "Analytical Notice",
        25,
        y + 9
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(muted);

      const notice =
        "This report presents automated analysis of public online comments. " +
        "It is intended for analytical and research purposes and does not " +
        "represent political endorsement or prediction.";

      const noticeLines =
        doc.splitTextToSize(
          notice,
          pageWidth - 50
        );

      doc.text(
        noticeLines,
        25,
        y + 16
      );

      /* ======================================================
         FOOTER + SAVE
      ====================================================== */

      addFooter();

      const safeTarget =
        (target || "Target")
          .replace(
            /[^a-zA-Z0-9]+/g,
            "_"
          )
          .replace(
            /^_+|_+$/g,
            "");

      doc.save(
        `PoliVerse_AI_${safeTarget}_Report.pdf`
      );
    } catch (error) {
      console.error(
        "PDF generation failed:",
        error
      );

      alert(
        "Unable to generate the PDF report. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generateReport}
      disabled={
        disabled || generating
      }
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-300 ${
        disabled || generating
          ? "cursor-not-allowed border border-black/10 bg-gray-100 text-gray-400"
          : "border border-[#138a55] bg-[#138a55] text-white shadow-[0_8px_20px_rgba(19,138,85,0.18)] hover:-translate-y-0.5 hover:bg-[#0f7447] hover:shadow-[0_12px_25px_rgba(19,138,85,0.25)]"
      }`}
    >
      <span className="text-sm">
        {generating ? "…" : "↓"}
      </span>

      {generating
        ? "Generating PDF..."
        : "Download PDF Report"}
    </button>
  );
}