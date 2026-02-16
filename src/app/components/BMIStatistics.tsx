import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "./ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const bmiCategories = [
  { name: "Underweight", value: 12, color: "#54acbf" },
  { name: "Normal", value: 58, color: "#26658c" },
  { name: "Overweight", value: 23, color: "#023859" },
  { name: "Obese", value: 7, color: "#a7ebf2" },
];

const globalStats = [
  { region: "Asia", underweight: 15, normal: 55, overweight: 22, obese: 8 },
  { region: "Europe", underweight: 8, normal: 52, overweight: 28, obese: 12 },
  { region: "Americas", underweight: 10, normal: 48, overweight: 30, obese: 12 },
  { region: "Africa", underweight: 18, normal: 60, overweight: 15, obese: 7 },
];

export function BMIStatistics() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#a7ebf2]/10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#011c40] mb-4">
            Understanding Body Mass Index
          </h2>
          <p className="text-lg text-[#026658c]/80 max-w-3xl mx-auto">
            BMI is a measure of body fat based on height and weight. It's a screening tool
            to identify potential weight-related health problems in adults.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* What is BMI */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 h-full bg-white border-[#54acbf]/20">
              <h3 className="text-2xl font-semibold text-[#023859] mb-6">What is BMI?</h3>
              <div className="space-y-4">
                <p className="text-[#026658c]/80">
                  Body Mass Index (BMI) is calculated using the formula:
                </p>
                <div className="bg-[#a7ebf2]/20 p-4 rounded-lg border border-[#54acbf]/30">
                  <p className="text-center text-xl font-semibold text-[#023859]">
                    BMI = Weight (kg) / [Height (m)]²
                  </p>
                </div>
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-[#54acbf]" />
                    <div>
                      <span className="font-semibold text-[#023859]">Underweight:</span>
                      <span className="text-[#026658c]/80"> BMI &lt; 18.5</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Minus className="w-5 h-5 text-[#26658c]" />
                    <div>
                      <span className="font-semibold text-[#023859]">Normal:</span>
                      <span className="text-[#026658c]/80"> BMI 18.5 - 24.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#023859]" />
                    <div>
                      <span className="font-semibold text-[#023859]">Overweight:</span>
                      <span className="text-[#026658c]/80"> BMI 25 - 29.9</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#a7ebf2]" />
                    <div>
                      <span className="font-semibold text-[#023859]">Obese:</span>
                      <span className="text-[#026658c]/80"> BMI ≥ 30</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Why it Matters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 h-full bg-white border-[#54acbf]/20">
              <h3 className="text-2xl font-semibold text-[#023859] mb-6">Why It Matters</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#54acbf] mt-2 flex-shrink-0" />
                  <p className="text-[#026658c]/80">
                    <span className="font-semibold text-[#023859]">Health Screening:</span> Identifies
                    potential health risks related to weight
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#26658c] mt-2 flex-shrink-0" />
                  <p className="text-[#026658c]/80">
                    <span className="font-semibold text-[#023859]">Disease Prevention:</span> Helps
                    monitor risk for heart disease, diabetes, and other conditions
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#023859] mt-2 flex-shrink-0" />
                  <p className="text-[#026658c]/80">
                    <span className="font-semibold text-[#023859]">Fitness Tracking:</span> Provides
                    a baseline for monitoring health improvements over time
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#a7ebf2] mt-2 flex-shrink-0" />
                  <p className="text-[#026658c]/80">
                    <span className="font-semibold text-[#023859]">Population Health:</span> Used by
                    health organizations to track obesity trends
                  </p>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Global Statistics Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          <Card className="p-8 bg-white border-[#54acbf]/20">
            <h3 className="text-xl font-semibold text-[#023859] mb-6 text-center">
              Global BMI Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bmiCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bmiCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-8 bg-white border-[#54acbf]/20">
            <h3 className="text-xl font-semibold text-[#023859] mb-6 text-center">
              BMI by Region (WHO Data)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={globalStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
                <XAxis dataKey="region" stroke="#026658c" />
                <YAxis stroke="#026658c" />
                <Tooltip />
                <Legend />
                <Bar dataKey="underweight" fill="#54acbf" />
                <Bar dataKey="normal" fill="#26658c" />
                <Bar dataKey="overweight" fill="#023859" />
                <Bar dataKey="obese" fill="#a7ebf2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
