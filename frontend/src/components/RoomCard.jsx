import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, FileText } from "lucide-react";
import { useState, useEffect } from "react";

const RoomCard = ({ room, onGuide }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "id"
  );

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("lang") || "id");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const buttonText = {
    id: "Antarkan ke Ruangan",
    en: "Guide to Room",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Card className=" rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            {room.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin /> <span className="font-medium">{room.location}</span>
          </p>
          <p className="flex items-start gap-2 mt-2">
            <span className="font-medium">{room.description}</span>
          </p>
          <Button onClick={() => onGuide(room)} className="w-full mt-4">
            {buttonText[language]}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
