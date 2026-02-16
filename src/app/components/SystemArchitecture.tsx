import { motion } from "framer-motion";
import { Cpu, Camera, Wifi, Database, Monitor, Zap } from "lucide-react";
import { Card } from "./ui/card";

export function SystemArchitecture() {
  return (
    <section id="system" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#011c40] mb-4">
            About This System
          </h2>
          <p className="text-lg text-[#026658c]/80 max-w-3xl mx-auto">
            Our Automated BMI System integrates advanced hardware and cloud technology
            to deliver accurate, secure, and accessible health measurements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-[#a7ebf2]/10 to-white border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Camera className="w-10 h-10 text-[#54acbf] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">
                Facial Recognition
              </h3>
              <p className="text-sm text-[#026658c]/80">
                Raspberry Pi Camera Module v3 performs secure user identification
                before measurements begin.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-[#a7ebf2]/10 to-white border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Zap className="w-10 h-10 text-[#26658c] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">
                Sensor Network
              </h3>
              <p className="text-sm text-[#026658c]/80">
                ToF sensor measures height accurately, while load cells with HX711 amplification
                capture precise weight data.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-[#a7ebf2]/10 to-white border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Cpu className="w-10 h-10 text-[#023859] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">
                Arduino Processing
              </h3>
              <p className="text-sm text-[#026658c]/80">
                Arduino Uno receives amplified sensor data and calculates BMI using
                height and weight measurements.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-[#a7ebf2]/10 to-white border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Wifi className="w-10 h-10 text-[#54acbf] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">
                Raspberry Pi API
              </h3>
              <p className="text-sm text-[#026658c]/80">
                Central processor manages data flow, user authentication, and communication
                between hardware and cloud.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-[#a7ebf2]/10 to-white border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Database className="w-10 h-10 text-[#26658c] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">
                Cloud Storage
              </h3>
              <p className="text-sm text-[#026658c]/80">
                Secure cloud database stores BMI records with user authentication
                for historical tracking and analysis.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-[#a7ebf2]/10 to-white border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Monitor className="w-10 h-10 text-[#023859] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">
                Display & Web Access
              </h3>
              <p className="text-sm text-[#026658c]/80">
                OLED screen shows immediate results, while web platform provides
                comprehensive analytics and history.
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Process Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 bg-gradient-to-br from-[#023859] to-[#26658c] text-white">
            <h3 className="text-2xl font-semibold mb-8 text-center">System Process Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <p className="font-semibold mb-1">Facial Recognition</p>
                <p className="text-sm text-white/80">User identification via camera</p>
              </div>
              
              <div className="hidden md:block text-3xl text-white/60">→</div>
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <p className="font-semibold mb-1">Measurement</p>
                <p className="text-sm text-white/80">Sensors capture height & weight</p>
              </div>
              
              <div className="hidden md:block text-3xl text-white/60">→</div>
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <p className="font-semibold mb-1">Processing</p>
                <p className="text-sm text-white/80">Arduino calculates BMI</p>
              </div>
              
              <div className="hidden md:block text-3xl text-white/60">→</div>
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <p className="font-semibold mb-1">Storage & Display</p>
                <p className="text-sm text-white/80">Cloud saves & shows results</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
