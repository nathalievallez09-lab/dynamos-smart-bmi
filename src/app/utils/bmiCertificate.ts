import jsPDF from "jspdf";
import { getHealthAdviceContent } from "../components/HealthTips";

type WeightUnit = "kg" | "lb";
type HeightUnit = "cm" | "ft-in";

export interface BMIHistoryRecord {
  id?: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
}

export interface BMICertificateUser {
  id: string;
  name?: string;
  age?: number;
  sex?: string;
  currentBMI: number;
  height: number;
  weight: number;
  history: BMIHistoryRecord[];
}

interface BMICertificateOptions {
  user: BMICertificateUser;
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  formatWeight: (weightKg: number, unit: WeightUnit) => string;
  formatHeight: (heightCm: number, unit: HeightUnit) => string;
  getBMICategory: (bmi: number) => { label: string; color: string };
}

const page = {
  width: 210,
  height: 297,
  margin: 16,
};

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getSortedHistory(history: BMIHistoryRecord[]) {
  return [...history]
    .filter((item) => Number.isFinite(item.bmi))
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
}

function calculateAnalytics(history: BMIHistoryRecord[]) {
  const sorted = getSortedHistory(history);
  const bmiValues = sorted.map((item) => item.bmi);
  const averageBMI = bmiValues.reduce((sum, value) => sum + value, 0) / bmiValues.length;
  const minBMI = Math.min(...bmiValues);
  const maxBMI = Math.max(...bmiValues);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const bmiChange = last.bmi - first.bmi;
  const weightChange = last.weight - first.weight;
  const weekly = sorted.slice(-8);

  const weeklyTrend =
    weekly.length < 2
      ? "Only one BMI record is available, so the weekly BMI trend is still building."
      : `Last ${weekly.length} records show BMI moving from ${weekly[0].bmi.toFixed(1)} to ${weekly[
          weekly.length - 1
        ].bmi.toFixed(1)}.`;

  const weightProgress =
    sorted.length < 2
      ? "Only one weight record is available, so weight progress is still building."
      : `Weight changed by ${weightChange >= 0 ? "+" : ""}${weightChange.toFixed(1)} kg from the first to the latest record.`;

  const progressSummary =
    bmiChange < 0
      ? `Positive Progress: BMI decreased by ${Math.abs(bmiChange).toFixed(1)} points. Keep following healthy routines and monitoring regularly.`
      : bmiChange > 0
        ? `BMI Increase Detected: BMI increased by ${bmiChange.toFixed(1)} points. Consider consulting a healthcare professional for guidance.`
        : "Stable BMI: BMI has remained consistent. Maintain current healthy habits and regular monitoring.";

  return {
    averageBMI,
    minBMI,
    maxBMI,
    bmiChange,
    weeklyTrend,
    weightProgress,
    progressSummary,
  };
}

function ensureSpace(doc: jsPDF, y: number, needed: number) {
  if (y + needed <= page.height - page.margin) {
    return y;
  }

  doc.addPage();
  return page.margin;
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addSectionTitle(doc: jsPDF, title: string, y: number) {
  const safeY = ensureSpace(doc, y, 14);
  doc.setFillColor(167, 235, 242);
  doc.rect(page.margin, safeY - 5, page.width - page.margin * 2, 9, "F");
  doc.setTextColor(2, 56, 89);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, page.margin + 3, safeY + 1);
  return safeY + 12;
}

function addKeyValue(doc: jsPDF, label: string, value: string, x: number, y: number) {
  doc.setFontSize(10);
  doc.setTextColor(2, 56, 89);
  doc.setFont("helvetica", "bold");
  doc.text(`${label}:`, x, y);
  doc.setFont("helvetica", "normal");
  doc.text(value || "-", x + 28, y);
}

function addHistoryTable(
  doc: jsPDF,
  history: BMIHistoryRecord[],
  options: BMICertificateOptions,
  y: number,
) {
  let currentY = y;
  const columns = [20, 37, 36, 20, 38];
  const headers = ["Date", "Weight", "Height", "BMI", "Status"];
  const startX = page.margin;

  const drawHeader = () => {
    doc.setFillColor(2, 56, 89);
    doc.rect(startX, currentY, columns.reduce((sum, width) => sum + width, 0), 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    let x = startX + 2;
    headers.forEach((header, index) => {
      doc.text(header, x, currentY + 6);
      x += columns[index];
    });
    currentY += 9;
  };

  drawHeader();

  history.forEach((record, index) => {
    currentY = ensureSpace(doc, currentY, 9);
    if (currentY === page.margin) {
      drawHeader();
    }

    doc.setFillColor(index % 2 === 0 ? 247 : 255, index % 2 === 0 ? 253 : 255, index % 2 === 0 ? 254 : 255);
    doc.rect(startX, currentY, columns.reduce((sum, width) => sum + width, 0), 8, "F");
    doc.setTextColor(1, 28, 64);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const row = [
      new Date(record.date).toLocaleDateString(),
      options.formatWeight(record.weight, options.weightUnit),
      options.formatHeight(record.height, options.heightUnit),
      record.bmi.toFixed(1),
      options.getBMICategory(record.bmi).label,
    ];

    let x = startX + 2;
    row.forEach((cell, cellIndex) => {
      doc.text(String(cell), x, currentY + 5.5);
      x += columns[cellIndex];
    });
    currentY += 8;
  });

  return currentY + 4;
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let index = 1; index <= pageCount; index += 1) {
    doc.setPage(index);
    doc.setDrawColor(84, 172, 191);
    doc.line(page.margin, 280, page.width - page.margin, 280);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(38, 101, 140);
    doc.text(
      "This certificate is generated by the Smart BMI System for health-monitoring purposes only. It is not a medical diagnosis. Please consult a licensed physician for professional medical advice.",
      page.margin,
      286,
      { maxWidth: page.width - page.margin * 2 },
    );
    doc.text(`Page ${index} of ${pageCount}`, page.width - page.margin - 20, 294);
  }
}

export function generateBMICertificate(options: BMICertificateOptions) {
  const { user, heightUnit, formatHeight, getBMICategory } = options;
  const history = getSortedHistory(user.history);
  const latestBMI = history[history.length - 1]?.bmi ?? user.currentBMI;
  const category = getBMICategory(latestBMI);
  const analytics = calculateAnalytics(history);
  const advice = getHealthAdviceContent(category.label, latestBMI, history);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  doc.setFillColor(2, 56, 89);
  doc.rect(0, 0, page.width, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Smart BMI Health Record Certificate", page.width / 2, 16, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Generated health-monitoring record for clinical consultation and personal tracking", page.width / 2, 24, {
    align: "center",
  });

  let y = 44;
  doc.setDrawColor(84, 172, 191);
  doc.setLineWidth(0.8);
  doc.roundedRect(page.margin, 38, page.width - page.margin * 2, 36, 2, 2);
  addKeyValue(doc, "Name", user.name || "Not provided", page.margin + 5, y);
  addKeyValue(doc, "Age", user.age ? String(user.age) : "Not provided", 112, y);
  y += 8;
  addKeyValue(doc, "Sex", user.sex || "Not provided", page.margin + 5, y);
  addKeyValue(doc, "Height", formatHeight(user.height, heightUnit), 112, y);
  y += 8;
  addKeyValue(doc, "User ID", user.id, page.margin + 5, y);
  addKeyValue(doc, "Date Generated", formatDate(new Date()), 112, y);
  y = 84;

  y = addSectionTitle(doc, "BMI History", y);
  y = addHistoryTable(doc, history, options, y);

  y = addSectionTitle(doc, "Analytics Summary", y + 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(1, 28, 64);
  const summaryLines = [
    `Average BMI: ${analytics.averageBMI.toFixed(1)}`,
    `Lowest BMI: ${analytics.minBMI.toFixed(1)}`,
    `Highest BMI: ${analytics.maxBMI.toFixed(1)}`,
    `BMI Change: ${analytics.bmiChange >= 0 ? "+" : ""}${analytics.bmiChange.toFixed(1)} from first record`,
    `Weekly Trend: ${analytics.weeklyTrend}`,
    `Weight Progress: ${analytics.weightProgress}`,
    `Progress Summary: ${analytics.progressSummary}`,
  ];

  summaryLines.forEach((line) => {
    y = ensureSpace(doc, y, 8);
    y = addWrappedText(doc, line, page.margin + 3, y, page.width - page.margin * 2 - 6);
    y += 2;
  });

  y = addSectionTitle(doc, "Health Advice", y + 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(2, 56, 89);
  y = addWrappedText(doc, advice.title, page.margin + 3, y, page.width - page.margin * 2 - 6);
  y += 2;

  advice.cards
    .filter((card) => card.title !== "Prediction")
    .forEach((card) => {
      y = ensureSpace(doc, y, 12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(2, 56, 89);
      doc.text(`${card.title}:`, page.margin + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(1, 28, 64);
      y = addWrappedText(doc, card.description, page.margin + 27, y, page.width - page.margin * 2 - 30);
      y += 2;
    });

  y = ensureSpace(doc, y, 18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(2, 56, 89);
  doc.text("Professional Approval Note:", page.margin + 3, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(1, 28, 64);
  y = addWrappedText(doc, advice.note, page.margin + 47, y, page.width - page.margin * 2 - 50);
  y += 7;

  y = addSectionTitle(doc, "Prediction/Forecast", y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(1, 28, 64);
  addWrappedText(
    doc,
    "Prediction/Forecast: Not available in the current system.",
    page.margin + 3,
    y,
    page.width - page.margin * 2 - 6,
  );

  addFooter(doc);
  doc.save(`smart-bmi-certificate-${user.id}.pdf`);
}
