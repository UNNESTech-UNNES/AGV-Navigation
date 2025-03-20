import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import roomsData from "@/data/data.json"; // Ensure this path is correct
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

const CariRuangan = ({ language }) => {
  const [espIp, setEspIp] = useState(
    localStorage.getItem("espIp") || "192.168.18.146"
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [roomResults, setRoomResults] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const recognitionRef = useRef(null);

  // Texts for different languages
  const texts = {
    id: {
      title: "Cari Ruangan",
      description: "Tekan tombol dan ucapkan nama ruangan yang anda cari",
      notFound: "Maaf, ruangan tidak ditemukan.",
      welcome: "Selamat datang, ruangan apa yang sedang Anda cari hari ini?",
      foundRooms: (count, rooms) => `Ditemukan ${count} ruangan: ${rooms}`,
      guiding: (room) =>
        `Baik, Anda akan saya antar ke ${room.name}. ${room.description}`,
      guide: "Mengantarkan Anda ...",
    },
    en: {
      title: "Find Room",
      description:
        "Press the button and say the name of the room you are looking for",
      notFound: "Sorry, room not found.",
      welcome: "Welcome, what room are you looking for today?",
      foundRooms: (count, rooms) => `Found ${count} rooms: ${rooms}`,
      guiding: (room) =>
        `Alright, I will guide you to ${room.name_en}. ${room.description_en}`,
      guide: "Guiding you ...",
    },
  };

  const sendCommandToESP = async (command) => {
    try {
      const response = await fetch(`http://${espIp}/command`, {
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
    speech.lang = language === "id" ? "id-ID" : "en-US";
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  const startNavigation = (room) => {
    setSelectedRoom(room);
    setShowDialog(true);
    setProgress(0);
    speak(texts[language].guiding(room));

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowDialog(false);
          setShowRoomDialog(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  useEffect(() => {
    // Selalu berbunyi setiap kali halaman dibuka
    speak(texts[language].welcome);

    // Periksa apakah browser mendukung SpeechRecognition
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Browser Anda tidak mendukung fitur pengenalan suara.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set konfigurasi recognition
    recognition.lang = language === "id" ? "id-ID" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    // Event handler
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);

      const foundRooms = Object.values(roomsData).filter((room) => {
        const roomName = language === "id" ? room.name : room.name_en;
        return (
          text.includes(roomName.toLowerCase()) ||
          (room.keyword && room.keyword.some((kw) => text.includes(kw)))
        );
      });

      if (foundRooms.length > 0) {
        setRoomResults(foundRooms.slice(0, 10));
        setNotFound(false);
        speak(
          texts[language].foundRooms(
            foundRooms.length,
            foundRooms
              .map((room) => (language === "id" ? room.name : room.name_en))
              .join(", ")
          )
        );
      } else {
        setRoomResults([]);
        setNotFound(true);
        speak(texts[language].notFound);
      }
    };

    // Simpan instance recognition ke dalam ref
    recognitionRef.current = recognition;

    return () => {
      // Cleanup: Hentikan recognition jika komponen di-unmount
      recognition.stop();
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleIpChange = (e) => {
    setEspIp(e.target.value);
    localStorage.setItem("espIp", e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <Header
        title={texts[language].title}
        description={texts[language].description}
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
        <Button className="relative">
          {isListening
            ? language === "id"
              ? "Mendengarkan..."
              : "Listening..."
            : language === "id"
            ? "Cari dengan Suara"
            : "Search by Voice"}
        </Button>
      </motion.button>

      {transcript && (
        <motion.p className="mt-4 text-sm text-muted-foreground">
          {language === "id"
            ? `Anda mencari: "${transcript}"`
            : `You are searching for: "${transcript}"`}
        </motion.p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 w-[90%] xl:w-[80%] ">
        {roomResults.map((room, index) => (
          <motion.div key={index} className="w-full max-w-sm">
            <Card className="rounded-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-left text-primary">
                  {language === "id" ? room.name : room.name_en}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="flex items-center gap-2 ">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">
                    {language === "id" ? room.location : room.location_en}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  {language === "id" ? room.description : room.description_en}
                </p>
                <Button
                  className="mt-4 w-full"
                  onClick={() => {
                    startNavigation(room);
                    sendCommandToESP(room.command);
                  }}
                >
                  {language === "id" ? "Antarkan Saya" : "Guide ke Ruangan"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-primary-foreground/50 z-50">
          <div className="bg-muted p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold">{texts[language].guide}</h2>
            <div className="mt-4">
              <Progress value={progress} />
            </div>
          </div>
        </div>
      )}

      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "id" ? selectedRoom?.name : selectedRoom?.name_en}
            </DialogTitle>
          </DialogHeader>
          <img
            src={selectedRoom?.image}
            alt={selectedRoom?.name}
            className="w-full h-60 object-cover rounded-lg"
          />
          <p className="mt-4">
            {language === "id"
              ? selectedRoom?.description
              : selectedRoom?.description_en}
          </p>
          <p className="text-muted-foreground flex gap-2 items-center">
            <MapPin className="h-5" />{" "}
            {language === "id"
              ? selectedRoom?.location
              : selectedRoom?.location_en}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CariRuangan;
