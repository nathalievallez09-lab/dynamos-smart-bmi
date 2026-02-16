import { Card } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface BMIHistoryData {
  date: string;
  bmi: number;
  weight: number;
  height: number;
}

interface BMIHistoryChartProps {
  data: BMIHistoryData[];
}

export function BMIHistoryChart({ data }: BMIHistoryChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <Card className="p-6 border-[#54acbf]/20">
      <h3 className="text-xl font-semibold text-[#023859] mb-6">BMI Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
          <XAxis dataKey="date" stroke="#026658c" />
          <YAxis domain={[15, 35]} stroke="#026658c" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #54acbf40",
              borderRadius: "8px",
            }}
          />
          
          {/* Reference lines for BMI categories */}
          <ReferenceLine
            y={18.5}
            stroke="#54acbf"
            strokeDasharray="3 3"
            label={{ value: "Underweight", position: "insideTopLeft", fill: "#54acbf" }}
          />
          <ReferenceLine
            y={25}
            stroke="#26658c"
            strokeDasharray="3 3"
            label={{ value: "Normal", position: "insideTopLeft", fill: "#26658c" }}
          />
          <ReferenceLine
            y={30}
            stroke="#023859"
            strokeDasharray="3 3"
            label={{ value: "Overweight", position: "insideTopLeft", fill: "#023859" }}
          />
          
          <Line
            type="monotone"
            dataKey="bmi"
            stroke="#54acbf"
            strokeWidth={3}
            dot={{ fill: "#26658c", r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
