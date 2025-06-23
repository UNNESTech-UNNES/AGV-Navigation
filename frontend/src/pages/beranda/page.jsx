import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarBorder from "@/components/reactbits/StarBorder/StarBorder.jsx";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const translations = {
  en: {
    welcome: "Welcome to Digital Center Building",
    subtitle: "We are ready to help, please choose a menu",
    find_room: "Find Room",
    view_map: "View Map",
    robot_name: "Automated Guided Vehicle Robot",
  },
  id: {
    welcome: "Selamat Datang di Gedung Digital Center",
    subtitle: "Kami siap membantu, Silakan pilih menu",
    find_room: "Cari Ruangan",
    view_map: "Lihat Denah",
    robot_name: "Automated Guided Vehicle Robot",
  },
};

const Home = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "id"
  );
  const t = translations[language];

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("lang") || "id");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
      {/* Perbaikan warna gradient */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          backgroundPositionY: ["0px", "200px"],
        }}
        transition={{
          opacity: { duration: 2, ease: "easeOut" },
          scale: { duration: 2, ease: "easeOut" },
          backgroundPositionY: {
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        className={cn(
          "absolute inset-0 bg-transparent",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* Radial gradient untuk efek fade di tengah */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-from)_20%,_rgba(0,0,0,0)_80%)] 
             from-blue-300 dark:from-blue-900"
      />

      {/* Konten utama */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center w-[90%] max-w-3xl"
      >
        <div className="flex items-center w-full relative">
          <div className="flex flex-col items-center w-full px-4 my-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StarBorder
                as="div"
                className="shadow-xs"
                color="white"
                speed="1s"
              >
                {t.robot_name}
              </StarBorder>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl 2xl:text-6xl font-bold mt-4 text-center leading-tight"
            >
              {t.welcome} <br /> Universitas Negeri Semarang
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-2 text-center text-sm md:text-base 2xl:text-xl"
            >
              {t.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4 flex gap-4"
            >
              <Link to="/daftar-ruangan">
                <Button size="lg">{t.find_room}</Button>
              </Link>
              <Link to="/denah">
                <Button variant="outline" size="lg">
                  {t.view_map}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
