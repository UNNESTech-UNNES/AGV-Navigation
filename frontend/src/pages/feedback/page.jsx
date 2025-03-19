import Header from "@/components/header";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const translations = {
  en: {
    title: "Feedback",
    description: "Give feedback for our services",
    scan_qr: "Scan the QR Code below to provide your feedback.",
    back_home: "Back to Home Page",
  },
  id: {
    title: "Ulasan",
    description: "Beri ulasan untuk layanan kami",
    scan_qr: "Pindai QR Code berikut untuk memberikan Ulasan Anda.",
    back_home: "Kembali ke Halaman Utama",
  },
};

const FeedbackPage = () => {
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
    <div>
      <Header title={t.title} description={t.description} variant="secondary" />
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
      >
        <Separator className="my-4" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="flex justify-center my-6 w-full"
      >
        <div className="w-[90%] xl:w-[80%] flex flex-col items-center gap-4">
          <img
            src="/qrcode.webp"
            alt="QR Code"
            className="w-[35%] xl:w-[25%]  mb-2"
          />
          <p className="text-muted-foreground text-center">{t.scan_qr}</p>
          <Link to="/">
            <Button size="lg">{t.back_home}</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
