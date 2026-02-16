import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#023859] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-[#54acbf]" />
              <span className="text-lg font-semibold">Smart BMI System</span>
            </div>
            <p className="text-white/70 text-sm">
              Automated health monitoring for a healthier community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  About BMI
                </a>
              </li>
              <li>
                <a href="#system" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  System Architecture
                </a>
              </li>
              <li>
                <a href="#authors" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#54acbf] mt-0.5 flex-shrink-0" />
                <span className="text-white/70">teamdynamos02@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#54acbf] mt-0.5 flex-shrink-0" />
                <span className="text-white/70">+63 938 432 2706</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#54acbf] mt-0.5 flex-shrink-0" />
                <span className="text-white/70">
                  Marikina Polytechnic College<br />
                  Marikina City, Philippines
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal & Policy</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-[#a7ebf2] transition-colors">
                  Data Protection
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-white/70 hover:text-[#a7ebf2] transition-colors flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mb-8 pt-8 border-t border-white/10">
          <a
            href="#"
            className="p-2 rounded-full bg-white/10 hover:bg-[#54acbf] transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-white/10 hover:bg-[#54acbf] transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-white/10 hover:bg-[#54acbf] transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} Marikina Polytechnic College. All rights reserved.
          </p>
          <p className="mt-1">
            Dynamos - Academic Research Capstone
          </p>
          <p className="mt-2 text-xs text-white/40">
            This system is not intended for collecting PII or securing sensitive medical data.
            For educational and research purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}