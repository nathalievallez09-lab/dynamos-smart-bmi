import { Card } from "./ui/card";
import { Lightbulb, Apple, Dumbbell, Heart, BedDouble, Droplets } from "lucide-react";

interface HealthTipsProps {
  category: string;
}

export function HealthTips({ category }: HealthTipsProps) {
  const getTips = () => {
    switch (category) {
      case "Underweight":
        return {
          color: "#54acbf",
          tips: [
            {
              icon: Apple,
              title: "Increase Calorie Intake",
              description: "Focus on nutrient-dense foods like nuts, avocados, and whole grains.",
            },
            {
              icon: Dumbbell,
              title: "Strength Training",
              description: "Build muscle mass through resistance exercises 3-4 times per week.",
            },
            {
              icon: BedDouble,
              title: "Get Adequate Rest",
              description: "Aim for 7-9 hours of quality sleep to support muscle recovery and growth.",
            },
          ],
        };
      case "Normal":
        return {
          color: "#26658c",
          tips: [
            {
              icon: Heart,
              title: "Maintain Balance",
              description: "Continue your healthy eating habits and regular physical activity.",
            },
            {
              icon: Dumbbell,
              title: "Stay Active",
              description: "Aim for 150 minutes of moderate exercise per week.",
            },
            {
              icon: Droplets,
              title: "Stay Hydrated",
              description: "Drink 8-10 glasses of water daily to maintain optimal health.",
            },
          ],
        };
      case "Overweight":
        return {
          color: "#023859",
          tips: [
            {
              icon: Apple,
              title: "Balanced Diet",
              description: "Focus on portion control and include more vegetables and lean proteins.",
            },
            {
              icon: Dumbbell,
              title: "Increase Activity",
              description: "Start with 30 minutes of moderate exercise most days of the week.",
            },
            {
              icon: Heart,
              title: "Monitor Progress",
              description: "Track your meals and exercise to stay accountable to your goals.",
            },
          ],
        };
      case "Obese":
        return {
          color: "#d4183d",
          tips: [
            {
              icon: Heart,
              title: "Consult a Professional",
              description: "Work with a healthcare provider to create a personalized health plan.",
            },
            {
              icon: Apple,
              title: "Dietary Changes",
              description: "Reduce processed foods and focus on whole, nutrient-rich options.",
            },
            {
              icon: Dumbbell,
              title: "Start Gradually",
              description: "Begin with low-impact activities like walking or swimming.",
            },
          ],
        };
      default:
        return {
          color: "#26658c",
          tips: [
            {
              icon: Heart,
              title: "Stay Healthy",
              description: "Maintain a balanced lifestyle with regular check-ups.",
            },
          ],
        };
    }
  };

  const { color, tips } = getTips();

  return (
    <Card className="p-6 border-[#54acbf]/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Lightbulb className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="text-xl font-semibold text-[#023859]">
          Health Tips for {category} BMI
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h4 className="font-semibold text-[#023859]">{tip.title}</h4>
              </div>
              <p className="text-sm text-[#026658c]/80">{tip.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#a7ebf2]/20 to-transparent rounded-lg border-l-4" style={{ borderColor: color }}>
        <p className="text-sm text-[#026658c]/80">
          <span className="font-semibold text-[#023859]">Remember:</span> These are general
          recommendations. Always consult with a healthcare professional before making
          significant changes to your diet or exercise routine.
        </p>
      </div>
    </Card>
  );
}
