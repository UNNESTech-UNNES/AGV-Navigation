import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background px-6">
      {/* Animasi 404 */}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-7xl md:text-9xl font-extrabold text-primary"
      >
        404
      </motion.h1>

      {/* Animasi Deskripsi */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="text md:text-md text-muted-foreground mt-4"
      >
        Oops! Halaman yang Anda cari tidak ditemukan.
      </motion.p>

      {/* Tombol Kembali ke Beranda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="mt-6"
      >
        <Link to="/">
          {" "}
          <Button size="lg">Kembali ke Beranda</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
