"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

const Page = () => {
  useEffect(() => {
    // Fungsi untuk mengucapkan teks secara otomatis saat halaman dimuat
    const speak = (text) => {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "id-ID"; // Bahasa Indonesia
      speech.rate = 1; // Kecepatan normal
      window.speechSynthesis.speak(speech);
    };

    speak("Sedang mengantarkan Anda ke ruangan tersebut");
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-black">
      {/* Animasi Background Gradien Berubah Warna */}
      <motion.div
        className="absolute inset-0 z-[-1] pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at bottom, #0894FF 20%, rgba(0,0,0,0) 80%)",
            "radial-gradient(circle at bottom, #C959DD 20%, rgba(0,0,0,0) 80%)",
            "radial-gradient(circle at bottom, #FF2E54 20%, rgba(0,0,0,0) 80%)",
            "radial-gradient(circle at bottom, #FF9004 20%, rgba(0,0,0,0) 80%)",
            "radial-gradient(circle at bottom, #FF2E54 20%, rgba(0,0,0,0) 80%)",
            "radial-gradient(circle at bottom, #C959DD 20%, rgba(0,0,0,0) 80%)",
            "radial-gradient(circle at bottom, #0894FF 20%, rgba(0,0,0,0) 80%)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
      />

      {/* Animasi Gelombang */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-50"
        animate={{ y: ["0%", "10%", "0%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="absolute bottom-0 left-0 w-full h-40 fill-blue-500">
          <path d="M0,128L48,122.7C96,117,192,107,288,122.7C384,139,480,181,576,197.3C672,213,768,203,864,197.3C960,192,1056,192,1152,186.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </motion.div>

      {/* Teks dengan Efek Animasi */}
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-white relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Sedang Mengantarkan Anda ke Ruangan Tersebut...
      </motion.h1>
    </div>
  );
};

export default Page;
