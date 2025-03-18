import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <div className=" flex flex-col items-center">
      <Header
        title="Tentang Kami"
        description="Beri Feedback untuk layanan kami"
        variant="secondary"
      />

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
            <h2 className="text-xl font-semibold text-center">
              Website Pencarian Ruangan Gedung DC
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Separator className="my-2" />
            </motion.div>
            <p className="text-muted-foreground text-left">
              Gedung Digital Center adalah portal interaktif berbasis teknologi
              yang dirancang untuk memudahkan pengguna dalam menjelajahi
              fasilitas gedung universitas. Website ini menghadirkan pengalaman
              inovatif melalui:
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "Pencarian Ruangan menggunakan teknologi pengenalan suara.",
                "Menyediakan Navigasi dengan Gambar Denah Gedung yang mudah dipahami.",
                "Umpan Balik Digital melalui integrasi dengan Google Form untuk meningkatkan layanan.",
              ].map((item, index) => (
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
              Automated Guided Vehicle (AGV) Robot
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Separator className="my-2" />
            </motion.div>
            <p className="text-muted-foreground text-left">
              Robot AGV atau Automated Guided Vehicle adalah bagian dari
              transformasi digital Gedung Digital Center. Robot ini dirancang
              untuk memberikan pengalaman modern kepada pengguna gedung melalui:
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "Interaksi Suara, memahami dan menjawab pertanyaan secara langsung.",
                "Navigasi Otomatis, membantu pengguna menuju ruangan tujuan.",
                "Layar Interaktif, menampilkan informasi denah gedung dan layanan lainnya.",
              ].map((item, index) => (
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
