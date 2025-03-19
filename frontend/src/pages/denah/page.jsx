import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const translations = {
  en: {
    title: "Floor Map",
    description: "Find and explore the floor maps",
    floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4"],
  },
  id: {
    title: "Denah Lantai",
    description: "Cari dan temukan denah yang Anda cari",
    floors: ["Lantai 1", "Lantai 2", "Lantai 3", "Lantai 4"],
  },
};

const Page = () => {
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
        className="flex justify-center my-4 w-full"
      >
        <Tabs defaultValue="1" className="w-[90%] xl:w-[80%]">
          {/* Tabs List lebih kecil */}
          <TabsList className="flex items-center max-w-xs mx-auto gap-2">
            {t.floors.map((floor, index) => (
              <TabsTrigger key={index} value={(index + 1).toString()}>
                {floor}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content tetap di tengah */}
          <div className="flex justify-center items-center">
            {t.floors.map((_, index) => (
              <TabsContent
                key={index}
                value={(index + 1).toString()}
                className="flex justify-center"
              >
                <img
                  src={`/${index + 1}.webp`}
                  className="w-[100%] xl:w-[65%]"
                  alt={t.floors[index]}
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Page;
