import { motion } from "framer-motion";

interface BMIGaugeProps {
  value: number;
}

export function BMIGauge({ value }: BMIGaugeProps) {
  // Calculate rotation angle for the needle (-90 to 90 degrees)
  // BMI range: 15 to 35
  const minBMI = 15;
  const maxBMI = 35;
  const clampedValue = Math.max(minBMI, Math.min(maxBMI, value));
  const percentage = (clampedValue - minBMI) / (maxBMI - minBMI);
  const rotation = -90 + percentage * 180;

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Background arc segments */}
        <path
          d="M 20 100 A 80 80 0 0 1 60 30"
          fill="none"
          stroke="#54acbf"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 60 30 A 80 80 0 0 1 100 20"
          fill="none"
          stroke="#26658c"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 100 20 A 80 80 0 0 1 140 30"
          fill="none"
          stroke="#023859"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 140 30 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#d4183d"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Center circle */}
        <circle cx="100" cy="100" r="8" fill="#011c40" />

        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          stroke="#011c40"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "100px 100px" }}
        />

        {/* BMI value text */}
        <text
          x="100"
          y="115"
          textAnchor="middle"
          className="text-2xl font-bold"
          fill="#023859"
        >
          {value.toFixed(1)}
        </text>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-2 mt-4 text-xs text-center">
        <div>
          <div className="w-full h-2 bg-[#54acbf] rounded mb-1" />
          <p className="text-[#026658c]/70">Under</p>
          <p className="font-semibold text-[#023859]">&lt;18.5</p>
        </div>
        <div>
          <div className="w-full h-2 bg-[#26658c] rounded mb-1" />
          <p className="text-[#026658c]/70">Normal</p>
          <p className="font-semibold text-[#023859]">18.5-24.9</p>
        </div>
        <div>
          <div className="w-full h-2 bg-[#023859] rounded mb-1" />
          <p className="text-[#026658c]/70">Over</p>
          <p className="font-semibold text-[#023859]">25-29.9</p>
        </div>
        <div>
          <div className="w-full h-2 bg-[#d4183d] rounded mb-1" />
          <p className="text-[#026658c]/70">Obese</p>
          <p className="font-semibold text-[#023859]">≥30</p>
        </div>
      </div>
    </div>
  );
}
