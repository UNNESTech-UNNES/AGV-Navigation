import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const translations = {
  en: {
    title: "About Us",
    description: "About Automated Guided Vehicle (AGV)",
    leftTitle: "DC Building Room Search Website",
    leftContent:
      "The Digital Center Building is a technology-based interactive portal designed to facilitate users in exploring university building facilities. This website offers an innovative experience through:",
    leftFeatures: [
      "Room search using voice recognition technology.",
      "Navigation with easy-to-understand building layout images.",
      "Digital feedback through integration with Google Forms to improve services.",
    ],
    rightTitle: "Automated Guided Vehicle (AGV) Robot",
    rightContent:
      "AGV Robot or Automated Guided Vehicle is part of the digital transformation of the Digital Center Building. This robot is designed to provide a modern experience for building users through:",
    rightFeatures: [
      "Voice interaction, understanding and answering questions directly.",
      "Automatic navigation, helping users reach their destination rooms.",
      "Interactive screen, displaying building layout information and other services.",
    ],
  },
  id: {
    title: "Tentang Kami",
    description: "Tentang Automated Guided Vehicle (AGV)",
    leftTitle: "Website Pencarian Ruangan Gedung DC",
    leftContent:
      "Gedung Digital Center adalah portal interaktif berbasis teknologi yang dirancang untuk memudahkan pengguna dalam menjelajahi fasilitas gedung universitas. Website ini menghadirkan pengalaman inovatif melalui:",
    leftFeatures: [
      "Pencarian Ruangan menggunakan teknologi pengenalan suara.",
      "Menyediakan Navigasi dengan Gambar Denah Gedung yang mudah dipahami.",
      "Umpan Balik Digital melalui integrasi dengan Google Form untuk meningkatkan layanan.",
    ],
    rightTitle: "Automated Guided Vehicle (AGV) Robot",
    rightContent:
      "Robot AGV atau Automated Guided Vehicle adalah bagian dari transformasi digital Gedung Digital Center. Robot ini dirancang untuk memberikan pengalaman modern kepada pengguna gedung melalui:",
    rightFeatures: [
      "Interaksi Suara, memahami dan menjawab pertanyaan secara langsung.",
      "Navigasi Otomatis, membantu pengguna menuju ruangan tujuan.",
      "Layar Interaktif, menampilkan informasi denah gedung dan layanan lainnya.",
    ],
  },
};

const Page = () => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "id");

  useEffect(() => {
    const handleLanguageChange = () => {
      setLang(localStorage.getItem("lang") || "id");
    };
    window.addEventListener("languageChange", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  const t = translations[lang];

  return (
    <div className="flex flex-col items-center">
      <Header title={t.title} description={t.description} variant="secondary" />

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
      >
        <Separator className="my-4" />
      </motion.div>

      {/* Wrapper Card */}
      <div className="flex justify-center items-center w-full mb-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-[90%] xl:w-[80%]">
          {/* Card Kiri - Website Pencarian Ruangan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="p-6 border rounded-lg w-full "
          >
            <h2 className="text-xl font-semibold text-center">{t.leftTitle}</h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Separator className="my-2" />
            </motion.div>
            <p className="text-muted-foreground text-left">{t.leftContent}</p>
            <ul className="mt-4 space-y-3">
              {t.leftFeatures.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                    <Check className="w-5 h-5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card Kanan - AGV Robot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="p-6 border rounded-lg w-full"
          >
            <h2 className="text-xl font-semibold text-center">
              {t.rightTitle}
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Separator className="my-2" />
            </motion.div>
            <p className="text-muted-foreground text-left">{t.rightContent}</p>
            <ul className="mt-4 space-y-3">
              {t.rightFeatures.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                    <Check className="w-5 h-5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;
