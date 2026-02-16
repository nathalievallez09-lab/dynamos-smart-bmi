import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface BMIHistoryData {
  date: string;
  bmi: number;
  weight: number;
  height: number;
}

interface BMIAnalyticsProps {
  data: BMIHistoryData[];
}

export function BMIAnalytics({ data }: BMIAnalyticsProps) {
  // Calculate statistics
  const averageBMI = data.reduce((sum, item) => sum + item.bmi, 0) / data.length;
  const minBMI = Math.min(...data.map((item) => item.bmi));
  const maxBMI = Math.max(...data.map((item) => item.bmi));
  
  const firstBMI = data[0].bmi;
  const lastBMI = data[data.length - 1].bmi;
  const bmiChange = lastBMI - firstBMI;
  const bmiChangePercent = ((bmiChange / firstBMI) * 100).toFixed(1);

  // Weekly data (group by week)
  const weeklyData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    bmi: item.bmi,
    weight: item.weight,
  }));

  // Monthly averages (simulated for demo)
  const monthlyData = [
    { month: "Dec", avgBMI: 24.0 },
    { month: "Jan", avgBMI: 23.7 },
    { month: "Feb", avgBMI: 23.5 },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 border-[#54acbf]/20">
        <h2 className="text-2xl font-bold text-[#023859] mb-6">Health Analytics</h2>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70 mb-1">Average BMI</p>
            <p className="text-2xl font-bold text-[#023859]">{averageBMI.toFixed(1)}</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Last 5 records</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70 mb-1">Lowest BMI</p>
            <p className="text-2xl font-bold text-[#54acbf]">{minBMI.toFixed(1)}</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Recorded minimum</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70 mb-1">Highest BMI</p>
            <p className="text-2xl font-bold text-[#023859]">{maxBMI.toFixed(1)}</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Recorded maximum</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <p className="text-sm text-[#026658c]/70 mb-1">Change</p>
            <div className="flex items-center gap-2">
              <p
                className={`text-2xl font-bold ${
                  bmiChange > 0 ? "text-[#d4183d]" : bmiChange < 0 ? "text-[#54acbf]" : "text-[#026658c]"
                }`}
              >
                {bmiChange > 0 ? "+" : ""}
                {bmiChange.toFixed(1)}
              </p>
              {bmiChange > 0 ? (
                <TrendingUp className="w-5 h-5 text-[#d4183d]" />
              ) : bmiChange < 0 ? (
                <TrendingDown className="w-5 h-5 text-[#54acbf]" />
              ) : (
                <Minus className="w-5 h-5 text-[#026658c]" />
              )}
            </div>
            <p className="text-xs text-[#026658c]/60 mt-1">
              {bmiChangePercent}% from first record
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#023859] mb-4">Weekly BMI Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
                <XAxis dataKey="date" stroke="#026658c" />
                <YAxis stroke="#026658c" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #54acbf40",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#54acbf"
                  strokeWidth={2}
                  dot={{ fill: "#26658c", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#023859] mb-4">Weight Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
                <XAxis dataKey="date" stroke="#026658c" />
                <YAxis stroke="#026658c" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #54acbf40",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="weight" fill="#26658c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Monthly Averages */}
      <Card className="p-6 border-[#54acbf]/20">
        <h3 className="text-lg font-semibold text-[#023859] mb-4">Monthly Average BMI</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
            <XAxis dataKey="month" stroke="#026658c" />
            <YAxis domain={[20, 26]} stroke="#026658c" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #54acbf40",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="avgBMI" fill="#023859" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Health Progress Summary */}
      <Card className="p-6 bg-gradient-to-r from-[#a7ebf2]/20 to-white border-[#54acbf]/20">
        <h3 className="text-lg font-semibold text-[#023859] mb-4">Progress Summary</h3>
        <div className="space-y-3">
          {bmiChange < 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#54acbf]/10 rounded-lg">
              <TrendingDown className="w-5 h-5 text-[#54acbf] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#023859]">Positive Progress!</p>
                <p className="text-sm text-[#026658c]/80">
                  Your BMI has decreased by {Math.abs(bmiChange).toFixed(1)} points. Keep up the
                  healthy lifestyle!
                </p>
              </div>
            </div>
          )}
          {bmiChange > 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#d4183d]/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#d4183d] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#023859]">BMI Increase Detected</p>
                <p className="text-sm text-[#026658c]/80">
                  Your BMI has increased by {bmiChange.toFixed(1)} points. Consider consulting a
                  healthcare professional for guidance.
                </p>
              </div>
            </div>
          )}
          {bmiChange === 0 && (
            <div className="flex items-start gap-3 p-3 bg-[#26658c]/10 rounded-lg">
              <Minus className="w-5 h-5 text-[#26658c] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#023859]">Stable BMI</p>
                <p className="text-sm text-[#026658c]/80">
                  Your BMI has remained consistent. Maintain your current healthy habits!
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
