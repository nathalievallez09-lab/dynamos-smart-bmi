import { Card } from "./ui/card";
import {
  Lightbulb,
  Activity,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";

export interface HealthTipsProps {
  category: string;
  bmi: number;
  history: Array<{
    id?: string;
    date: string;
    bmi: number;
    weight: number;
    height: number;
  }>;
}

function getTrendSummary(history: HealthTipsProps["history"]) {
  const sorted = [...history]
    .filter((item) => Number.isFinite(item.bmi))
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());

  if (sorted.length < 2) {
    return {
      title: "Recent trend is still building",
      description:
        "More check-ins will help show whether your routine is moving your BMI up, down, or staying steady.",
      icon: Minus,
      iconColor: "#26658c",
    };
  }

  const recent = sorted.slice(-3);
  const first = recent[0].bmi;
  const last = recent[recent.length - 1].bmi;
  const delta = Number((last - first).toFixed(1));

  if (Math.abs(delta) <= 0.3) {
    return {
      title: "Your recent weight trend is stable",
      description:
        "That makes it easier to tell whether your current routine is working and easier to maintain.",
      icon: Minus,
      iconColor: "#26658c",
    };
  }

  if (delta < 0) {
    return {
      title: "Your recent BMI trend is moving down",
      description:
        "This may reflect weight loss or improved balance if you are moving toward your target range.",
      icon: TrendingDown,
      iconColor: "#16a34a",
    };
  }

  return {
    title: "Your recent BMI trend is moving up",
    description:
      "A continued rise may increase weight-related health strain if it keeps moving away from the healthy range.",
    icon: TrendingUp,
    iconColor: "#d4183d",
  };
}

export function getHealthAdviceContent(category: string, bmi: number, history: HealthTipsProps["history"]) {
  const trend = getTrendSummary(history);

  switch (category) {
    case "Underweight":
      return {
        color: "#54acbf",
        title: "Health Advice for Underweight BMI",
        cards: [
          {
            icon: Activity,
            title: "Status",
            description: `BMI ${bmi.toFixed(1)} is below the normal range. It may be linked with lower energy reserves, reduced muscle mass, and slower recovery.`,
            iconColor: "#54acbf",
          },
          {
            icon: Sparkles,
            title: "Prediction",
            description:
              "If BMI stays low, you may feel fatigue, have less physical reserve, and need nutrition support and weight management.",
            iconColor: "#26658c",
          },
          {
            icon: Sparkles,
            title: "Recommended Action",
            description:
              "Encourage balanced meals, strength-building activity, enough sleep, and regular follow-up checks.",
            iconColor: "#54acbf",
          },
          {
            icon: trend.icon,
            title: "Trend",
            description: `${trend.title}. ${trend.description}`,
            iconColor: trend.iconColor,
          },
        ],
        note:
          "Should be checked by a healthcare professional like doctors and nurse especially if there is appetite loss, unexplained weight loss or weakness. If experience any of the symptoms consult or seek advice to any medical healthcare personnel.",
      };
    case "Normal":
      return {
        color: "#26658c",
        title: "Health Advice for Normal BMI",
        cards: [
          {
            icon: Activity,
            title: "Status",
            description: `BMI ${bmi.toFixed(1)} is within the normal range and supports lower weight-related risk when maintained with steady habits.`,
            iconColor: "#16a34a",
          },
          {
            icon: Sparkles,
            title: "Prediction",
            description:
              "Maintaining this range may support steady energy, easier movement, and lower risk of weight-related conditions.",
            iconColor: "#26658c",
          },
          {
            icon: Sparkles,
            title: "Recommended Action",
            description:
              "Continue balanced meals, regular activity, good sleep, and regular BMI monitoring.",
            iconColor: "#54acbf",
          },
          {
            icon: trend.icon,
            title: "Trend",
            description: `${trend.title}. ${trend.description}`,
            iconColor: trend.iconColor,
          },
        ],
        note:
          "Monitor weight to ensure body composition remains healthy and focus on consistency and maintaining healthy lifestyle habits.",
      };
    case "Overweight":
      return {
        color: "#023859",
        title: "Health Advice for Overweight BMI",
        cards: [
          {
            icon: Activity,
            title: "Status",
            description: `BMI ${bmi.toFixed(1)} is above the normal range and may increase weight-related health risk over time.`,
            iconColor: "#f59e0b",
          },
          {
            icon: Sparkles,
            title: "Prediction",
            description:
              "If BMI remains in this range, there may be higher risk for heart-related conditions, poor sleep quality, blood sugar-related conditions, and other weight-related disease conditions.",
            iconColor: "#26658c",
          },
          {
            icon: Sparkles,
            title: "Recommended Action",
            description:
              "Start lifestyle changes such as balanced diet, walking, exercise, better sleep, and monitoring weight.",
            iconColor: "#54acbf",
          },
          {
            icon: trend.icon,
            title: "Trend",
            description: `${trend.title}. ${trend.description}`,
            iconColor: trend.iconColor,
          },
        ],
        note:
          "Weight-management advice should be reviewed by a healthcare professional.",
      };
    default:
      return {
        color: "#d4183d",
        title: "Health Advice for Obese BMI",
        cards: [
          {
            icon: Activity,
            title: "Status",
            description: `BMI ${bmi.toFixed(1)} is in the obesity range and is linked with higher risk for weight-related health conditions.`,
            iconColor: "#d4183d",
          },
          {
            icon: Sparkles,
            title: "Prediction",
            description:
              "Higher risk for heart-related disease like hypertension and blood sugar disease like diabetes plus other weight-related problems.",
            iconColor: "#26658c",
          },
          {
            icon: Sparkles,
            title: "Recommended Action",
            description:
              "Balanced diet, better sleep habits, plus monitoring of weight.",
            iconColor: "#54acbf",
          },
          {
            icon: trend.icon,
            title: "Trend",
            description: `${trend.title}. ${trend.description}`,
            iconColor: trend.iconColor,
          },
        ],
        note:
          "Must be clearly reviewed or approved by a qualified health professional.",
      };
  }
}

export function HealthTips({ category, bmi, history }: HealthTipsProps) {
  const { color, title, cards, note } = getHealthAdviceContent(category, bmi, history);

  return (
    <Card className="p-6 border-[#54acbf]/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Lightbulb className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-xl font-semibold text-[#023859]">{title}</h3>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="rounded-xl border border-[#54acbf]/20 bg-[#a7ebf2]/10 p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${card.iconColor}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
                </div>
                <h4 className="font-semibold text-[#023859]">{card.title}</h4>
              </div>
              <p className="text-sm leading-7 text-[#023859]/90">{card.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#a7ebf2]/20 to-transparent rounded-lg border-l-4" style={{ borderColor: color }}>
        <p className="text-sm text-[#026658c]/80">
          <span className="font-semibold text-[#023859]">Professional Approval Note:</span> {note}
        </p>
      </div>
    </Card>
  );
}
