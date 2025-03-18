import Header from "@/components/header";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const page = () => {
  return (
    <div>
      <Header
        title="Denah"
        description="Cari dan temukan Denah yang anda cari"
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
        className="flex justify-center my-4 w-full"
      >
        <Tabs defaultValue="1" className="w-[90%] xl:w-[80%]">
          {/* Tabs List lebih kecil */}
          <TabsList className="flex  items-center max-w-xs mx-auto gap-2">
            <TabsTrigger value="1">Lantai 1</TabsTrigger>
            <TabsTrigger value="2">Lantai 2</TabsTrigger>
            <TabsTrigger value="3">Lantai 3</TabsTrigger>
            <TabsTrigger value="4">Lantai 4</TabsTrigger>
          </TabsList>

          {/* Tabs Content tetap di tengah */}
          <div className="flex justify-center items-center">
            <TabsContent value="1" className="flex  justify-center">
              <img src="/1.webp" className="w-[100%] xl:w-[65%]" alt="" />
            </TabsContent>
            <TabsContent value="2" className="flex  justify-center">
              {" "}
              <img src="/2.webp" className="w-[100%] xl:w-[65%]" alt="" />
            </TabsContent>
            <TabsContent value="3" className="flex  justify-center">
              {" "}
              <img src="/3.webp" className="w-[100%] xl:w-[65%]" alt="" />
            </TabsContent>
            <TabsContent value="4" className="flex  justify-center">
              {" "}
              <img src="/4.webp" className="w-[100%] xl:w-[65%]" alt="" />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default page;
