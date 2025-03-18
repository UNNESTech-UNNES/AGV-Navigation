import Header from "@/components/header";
import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const page = () => {
  return (
    <div>
      <Header
        title="Feedback"
        description="Beri Feedback untuk layanan kami"
        variant="secondary"
      />{" "}
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
            alt=""
            className="w-[100%] xl:w-[25%]  mb-2"
          />
          <p className="text-muted-foreground text-center">
            Pindai QR Code berikut untuk memberikan feedback Anda.
          </p>
          <Link to="/">
            <Button size="lg">Kembali ke Halaman Utama</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default page;
