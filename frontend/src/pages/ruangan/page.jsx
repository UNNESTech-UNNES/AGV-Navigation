import Header from "@/components/header";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import RoomCard from "@/components/RoomCard";
import roomsData from "@/data/data.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const sendCommandToESP = async (command) => {
    try {
      const response = await fetch("http://192.168.4.1/command", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: command.toString(),
      });

      if (response.ok) {
        console.log(`Perintah ${command} dikirim ke ESP32`);
      } else {
        console.error("Gagal mengirim perintah");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const roomsArray = Object.values(roomsData).map((room, index) => ({
    id: index,
    ...room,
    floor: room.location.match(/Lantai (\d+)/)?.[1] || "1",
  }));

  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "id-ID";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleGuide = (room) => {
    setLoading(true);
    setProgress(0);
    speak(`Baik, Anda akan saya antar ke ${room.name}. ${room.description}`);

    let duration = 4000; // Total waktu dalam ms (4 detik)
    let interval = 100; // Interval update dalam ms
    let step = 100 / (duration / interval); // Hitung kenaikan per interval

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    setTimeout(() => {
      setLoading(false);
      setSelectedRoom(room);
    }, 4000); // Simulasi loading selesai dalam 4 detik
  };

  return (
    <div className="flex flex-col items-center">
      <Header
        title="Daftar Ruangan"
        description="Cari dan temukan ruangan yang anda cari"
        variant="secondary"
      />

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
        className="flex justify-center my-2 w-full"
      >
        <Tabs
          defaultValue="1"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[90%] xl:w-[80%]"
        >
          <TabsList className="flex items-center max-w-xs mx-auto gap-2">
            {["1", "2", "3", "4"].map((floor) => (
              <TabsTrigger key={floor} value={floor}>
                Lantai {floor}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex justify-center w-full">
            {["1", "2", "3", "4"].map((floor) => (
              <TabsContent key={floor} value={floor} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 w-full">
                  {roomsArray
                    .filter((room) => room.floor === floor)
                    .map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        onGuide={() => {
                          sendCommandToESP(room.command);
                          handleGuide(room);
                        }}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </motion.div>

      {/* Dialog Popup untuk Ruangan */}
      {selectedRoom && (
        <Dialog
          open={!!selectedRoom}
          onOpenChange={() => setSelectedRoom(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRoom.name}</DialogTitle>
            </DialogHeader>
            <img
              src={selectedRoom.image}
              alt={selectedRoom.name}
              className="w-full h-60 object-cover rounded-lg"
            />
            <p>{selectedRoom.description}</p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{selectedRoom.location}</span>
            </p>
          </DialogContent>
        </Dialog>
      )}

      {/* Loading Overlay dengan Progress Bar */}
      {loading && (
        <div className="fixed inset-0 flex items-center bg-primary-foreground/50 justify-center z-50 ">
          <div className="bg-muted p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold">
              Menghantarkan Anda ke {selectedRoom?.name}...
            </h2>
            <div className="mt-4">
              <Progress value={progress} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
