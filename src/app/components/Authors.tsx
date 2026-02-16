import { motion } from "framer-motion";
import { Mail, Facebook } from "lucide-react";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const authors = [
  {
    name: "John Mikko S. Santos",
    role: "Lead Developer & Hardware Integration",
    image: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/591655770_789645560789130_5758663412963980912_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEX7V9OPDmcMwMXeVCpmB8i0g3ODBuBzlbSDc4MG4HOVrPMmSvVBtCN_EdQTh4G9FGBes8vTmxzteITvsW3zLqW&_nc_ohc=JSyCobfTCnIQ7kNvwGvXW5S&_nc_oc=AdnqCTDRWnLKEQXBgfNvqHZViE8KKDCwYjaGdrzCAc9I1ZIWoBhrLQGcv1l1Pwf9lmY&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&oh=03_Q7cD4gFeeX94dcn6GFyKC8M-6ZilSTSBByR5EGk4HiNmyLi8jQ&oe=69B7D682",
    bio: "Electronics Engineering student specializing in hardware integration.",
    email: "maria.santos@mpc.edu.ph",
    facebook: "https://www.facebook.com/mikko.santos.71697"
  },
  {
    name: "Nathalie Bernadette L. Vallez",
    role: "Software Developer & UI/UX Designer",
    image: "https://scontent.fmnl17-5.fna.fbcdn.net/v/t1.15752-9/591185643_864495129409581_6565830756982220326_n.jpg?stp=dst-jpg_s2048x2048_tt6&_nc_cat=102&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGEUjd3RxO5Q_Dw98ljZNi6xleAMeMO1T_GV4Ax4w7VP00Zqkv_MHZmBVbJSjVx-eDaCzkBcULNaE8Pn2q--t_l&_nc_ohc=c9AOVo2FDy0Q7kNvwGPXPXb&_nc_oc=AdlZECx2Xxthp1ijyItIEo4sEciWjg92jVGvkaBC7gSVsWfrSAdzqHXKA9BR26MrSII&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&oh=03_Q7cD4gHQJ_Dkoa-m-X7FgZmg1eemKNHENXjqBBw-ce5SrNKGcw&oe=69B7EF68",
    bio: "Electronics Engineering student passionate about embedded systems and IoT solutions, web development and user experience design.",
    email: "nathalievallezmpc@gmail.com",
    facebook: "https://www.facebook.com/nathalie.vallez.7"
  },
  {
    name: "Jameson P. Chavenia",
    role: "Database Administrator & Cloud Integration",
    image: "https://scontent.fmnl17-8.fna.fbcdn.net/v/t1.15752-9/593461271_854857823913147_8298495401012104287_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGLyYzmADnFACthSbznqgz25TJjaE10etXlMmNoTXR61R25dqm-7R6w9vPlR5irxPyXIPLtLqpUlYT4x9dIxrwY&_nc_ohc=KKEVA-db7LUQ7kNvwGelET0&_nc_oc=Adnb8L3TH2JwJh2FDW5tKufituZMIu9xmH7IclYirHIhORv5CRf8xEKDMSv67ek2eL4&_nc_zt=23&_nc_ht=scontent.fmnl17-8.fna&oh=03_Q7cD4gEBfswmjG17b6C3K9sUNNWmLdnAZnWS70483rFyFrUZQQ&oe=69B7EF84",
    bio: "Electronics Engineering student focused on database management and cloud computing technologies.",
    email: "ana.reyes@mpc.edu.ph",
    facebook: "https://www.facebook.com/jameson.chavenia#"
  },
  {
    name: "Jerry N. Reyes",
    role: "Hardware Specialist & Sensor Integration",
    image: "https://scontent.fmnl17-2.fna.fbcdn.net/v/t1.15752-9/634184687_886893760876819_8045326745182319211_n.png?_nc_cat=111&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGrmvS9wYGpOZmqGO3KmzJg0vnyIpeq2Y7S-fIil6rZjpCs9mOdKBCz81kY5TATsNK5ZkpdLzvmJj_K-kc6gdej&_nc_ohc=lcb3l5dklEsQ7kNvwFxLNM9&_nc_oc=AdkfMSPOF4NTzVrBctnFwIBrfBcZBBdP-TxB_9A4smfz8aV0c_zA2m13zsS7YHuRqAo&_nc_zt=23&_nc_ht=scontent.fmnl17-2.fna&oh=03_Q7cD4gH9I3MyugPY-7VKimZN0PUsgFhUAlD1-nIkeyhGLWvWjw&oe=69BA4A86",
    bio: "Electronics Engineering student specializing in sensor networks and Arduino programming.",
    email: "carlos.martinez@mpc.edu.ph",
    facebook: "https://www.facebook.com/itsjerryreyes13"
  },
  {
    name: "Megumi Anne Sambrano",
    role: "Hardware Specialist & Document Researcher",
    image: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/633065879_1314109077200805_3531670076399143730_n.png?_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeGWxaXKStYWdOT3uUywy0kf2csbuZujRcrZyxu5m6NFyt0zos3Mht1w6TSRXFD6c7CVlGO6SyfOL6rHyeeKULwx&_nc_ohc=x5xUak44GNIQ7kNvwHXnqeY&_nc_oc=AdnhEjimL5KiYjBdlQTB3J0SHs2vAnXP7j695DhPY9sAbW6YX-wiuvgMab8Ro1wSpwg&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&oh=03_Q7cD4gE059TBQlgZYcEGydl3KebGBiIqHkY7ZLDxqFUmaZ2UIA&oe=69BA42B3",
    bio: "Electronics Engineering student working on hardware integration and document researcher.",
    email: "sofia.garcia@mpc.edu.ph",
    facebook: "https://www.facebook.com/megumianne.sambrano#"
  },
  {
    name: "Eugie Mark V. Caminade",
    role: "Systems Architect",
    image: "https://scontent.fmnl17-6.fna.fbcdn.net/v/t1.15752-9/591990018_1228412102526896_7540121066863669951_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEIJRrU-hhQEPVwQFkrMc48LfHEBWh345ot8cQFaHfjmqtQKT4VkePk52gAYKG5zaTlkqVuSe7tooMy44XDGymh&_nc_ohc=AZevLReaboIQ7kNvwH0IfZ6&_nc_oc=AdkdHrB_OAU4JdQSRg3To6fJXmpmtPXfaCFaazqeUGSFngJxiROHzZ1OzKw5aZZEb98&_nc_zt=23&_nc_ht=scontent.fmnl17-6.fna&oh=03_Q7cD4gEHGkfC7f_XizhViwlLzP5wwQUbpjoLzheRZ2VjnsOL7g&oe=69B7E4FC",
    bio: "Electronics Engineering student focused on system architecture and hardware integration.",
    email: "miguel.ramos@mpc.edu.ph",
    facebook: "https://www.facebook.com/eugie.mark.2024"
  },
];

export function Authors() {
  return (
    <section
      id="authors"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#a7ebf2]/10 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="text-4xl font-bold text-[#011c40] mb-4">Meet the Team</h2>
          <p className="text-lg text-[#026658c]/80 max-w-2xl mx-auto mb-8">
            Electronics Engineering students from Marikina Polytechnic College dedicated to innovative health technology solutions.
          </p>

          <div className="flex justify-center items-center gap-3 mb-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#023859]">Marikina Polytechnic College</p>
              <p className="text-sm text-[#026658c]/70">College of Engineering</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {authors.map((author, index) => (
            <motion.div
              key={author.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full bg-white border-[#54acbf]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#54acbf]">
                  <ImageWithFallback src={author.image} alt={author.name} className="w-full h-full object-cover" />
                </div>

                <h3 className="text-xl font-semibold text-[#023859] text-center mb-1">{author.name}</h3>
                <p className="text-sm text-[#54acbf] text-center mb-3 font-medium">{author.role}</p>
                <p className="text-sm text-[#026658c]/80 text-center mb-4">{author.bio}</p>

                <div className="flex justify-center gap-3 pt-4 border-t border-[#54acbf]/20">
                  <a
                    href={`mailto:${author.email}`}
                    className="p-2 rounded-full bg-[#a7ebf2]/20 hover:bg-[#54acbf] text-[#026658c] hover:text-white transition-colors"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={author.facebook || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#a7ebf2]/20 hover:bg-[#54acbf] text-[#026658c] hover:text-white transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <Card className="overflow-hidden border-[#54acbf]/20">
            <div className="relative h-64 md:h-80">
              <ImageWithFallback
                src="https://i0.wp.com/mpc.edu.ph/wp-content/uploads/2024/01/marikina-polytechnic-college-gate.jpg?fit=1200%2C720&ssl=1&w=640"
                alt="Marikina Polytechnic College"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#023859]/90 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Marikina Polytechnic College</h3>
                  <p className="text-white/90">Committed to developing innovative solutions for community health and wellness</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
