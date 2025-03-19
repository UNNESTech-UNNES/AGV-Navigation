import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import roomsData from "@/data/data.json";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const CariRuangan = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [roomResults, setRoomResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const recognitionRef = useRef(null);

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

  const speak = (text) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "id-ID";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const startNavigation = (room) => {
    setSelectedRoom(room);
    setShowDialog(true);
    setProgress(0);
    speak(`Baik, Anda akan saya antar ke ${room.name}. ${room.description}`);

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowDialog(false);
          setShowRoomDialog(true);
          return 100;
        }
        return prev + 25; // Naik 25% setiap 400ms (4 langkah)
      });
    }, 400); // Interval 400ms, total 4 detik
  };

  useEffect(() => {
    if (!sessionStorage.getItem("welcomeSpoken")) {
      speak("Selamat datang, ruangan apa yang sedang Anda cari hari ini?");
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "id-ID";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        setTranscript(text);

        const foundRooms = Object.values(roomsData).filter(
          (room) =>
            text.includes(room.name.toLowerCase()) ||
            (room.keyword && room.keyword.some((kw) => text.includes(kw)))
        );

        if (foundRooms.length > 0) {
          setRoomResults(foundRooms.slice(0, 3));
          setNotFound(false);
          speak(
            `Ditemukan ${foundRooms.length} ruangan: ${foundRooms
              .map((room) => room.name)
              .join(", ")}`
          );
        } else {
          setRoomResults([]);
          setNotFound(true);
          speak("Maaf, ruangan tidak ditemukan.");
        }
      };
    } else {
      alert("Browser Anda tidak mendukung fitur pengenalan suara.");
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Header
        title="Cari Ruangan"
        description="Tekan tombol dan ucapkan nama ruangan yang anda cari"
        variant="secondary"
      />
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 3, delay: 0.6, ease: "easeOut" }}
      >
        <Separator className="my-4" />
      </motion.div>

      <motion.button
        onClick={startListening}
        className="relative rounded-md overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
      >
        {/* Glow Border Effect */}
        {isListening && (
          <motion.div
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at bottom, var(--tw-gradient-from) 20%, rgba(0,0,0,0) 80%)",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
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
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Button */}
        <Button className="relative">
          {isListening ? "Mendengarkan..." : "Cari dengan Suara"}
        </Button>
      </motion.button>

      {transcript && (
        <motion.p className="mt-4 text-sm text-muted-foreground">
          Anda mencari: "{transcript}"
        </motion.p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 w-[90%] xl:w-[80%]">
        {roomResults.map((room, index) => (
          <motion.div key={index} className="w-full max-w-sm">
            <Card className="rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-left text-primary">
                  {room.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="flex items-center gap-2 ">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{room.location}</span>
                </p>
                {room.description && (
                  <p className="flex items-center gap-2 mt-2">
                    <span className="font-medium text-left">
                      {room.description}
                    </span>
                  </p>
                )}
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    startNavigation(room);
                    sendCommandToESP(room.command);
                  }}
                >
                  Antarkan Saya
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {notFound && (
        <motion.div className="mt-6 p-6 text-red-600 dark:text-red-400 rounded-lg ">
          Maaf, ruangan tidak ditemukan. Silakan coba lagi.
        </motion.div>
      )}

      {showDialog && (
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

      {/* Dialog untuk Menampilkan Detail Ruangan */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRoom?.name}</DialogTitle>
          </DialogHeader>
          <img
            src={selectedRoom?.image}
            alt={selectedRoom?.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <p className="mt-4">{selectedRoom?.description}</p>
          <p className="text-muted-foreground">
            Lokasi: {selectedRoom?.location}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CariRuangan;
