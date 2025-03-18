import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarBorder from "@/components/reactbits/StarBorder/StarBorder.jsx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} // Mulai dari transparan dan kecil
        animate={{
          opacity: 1,
          scale: 1,
          backgroundPositionY: ["0px", "200px"], // Grid turun terus-menerus
        }}
        transition={{
          opacity: { duration: 2, ease: "easeOut" }, // Fade in
          scale: { duration: 2, ease: "easeOut" }, // Scale in
          backgroundPositionY: {
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }, // Grid turun
        }}
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-b from-blue-300 dark:from-blue-900",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      {/* Background Gradient */}
      {/* <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
      >
        <Separator />
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-from)_20%,_rgba(0,0,0,0)_80%)] 
             from-blue-300 dark:from-blue-900"
      />
      {/* Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center w-[90%] max-w-3xl"
      >
        <div className="flex items-center w-full relative">
          {/* <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100%", opacity: 1 }}
            transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
          >
            <Separator
              orientation="vertical"
              className="h-full min-h-screen md:h-full absolute left-0 "
            />
          </motion.div> */}
          <div className="flex flex-col items-center w-full px-4 my-4">
            {/* Badge AGV */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StarBorder
                as="div"
                className="shadow-xs "
                color="white"
                speed="1s"
              >
                Automated Guided Vehicle Robot
              </StarBorder>
            </motion.div>

            {/* Hero Section */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl 2xl:text-6xl font-bold mt-4 text-center leading-tight"
            >
              Selamat Datang di Gedung Digital Center <br />
              Universitas Negeri Semarang
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-2 text-center text-sm md:text-base 2xl:text-xl"
            >
              Kami siap membantu, Silakan pilih menu
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-4 flex gap-4"
            >
              <Link to="/cari-ruangan">
                <Button size="lg">Cari Ruangan</Button>
              </Link>
              <Link to="/denah">
                <Button variant="outline" size="lg">
                  Lihat Denah
                </Button>
              </Link>
            </motion.div>
          </div>
          {/* <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100%", opacity: 1 }}
            transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
          >
            <Separator
              orientation="vertical"
              className="min-h-screen md:h-full  absolute right-0"
            />
          </motion.div> */}
        </div>
      </motion.div>
      {/* <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
      >
        <Separator />
      </motion.div> */}
    </div>
  );
};

export default Home;
