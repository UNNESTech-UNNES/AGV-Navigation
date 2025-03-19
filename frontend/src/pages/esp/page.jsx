import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { toast } from "sonner";

const ESPSettings = ({ language }) => {
  // Accept language as a prop
  const [ipAddress, setIpAddress] = useState(
    localStorage.getItem("espIp") || "192.168.18.146"
  );

  useEffect(() => {
    setIpAddress(localStorage.getItem("espIp") || "192.168.18.146");
  }, []);

  const validateIp = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
  };

  const handleSave = () => {
    if (validateIp(ipAddress)) {
      localStorage.setItem("espIp", ipAddress);
      toast.success(
        language === "id"
          ? "Alamat IP ESP32 berhasil diperbarui."
          : "ESP32 IP address updated successfully."
      );
    } else {
      toast.error(
        language === "id"
          ? "Format alamat IP tidak valid. Mohon masukkan IP yang benar."
          : "Invalid IP address format. Please enter a valid IP."
      );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <Header
        title={language === "id" ? "Pengaturan ESP32" : "ESP32 Settings"}
        description={
          language === "id"
            ? "Atur alamat IP ESP32 untuk komunikasi"
            : "Set the ESP32 IP address for communication"
        }
        variant="secondary"
      />

      <div className="w-full max-w-lg rounded-lg p-4 md:p-6 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {language === "id" ? "Alamat IP ESP32" : "ESP32 IP Address"}
          </label>
          <Input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="192.168.x.x"
            className="w-full"
            aria-label={
              language === "id" ? "Alamat IP ESP32" : "ESP32 IP Address"
            }
          />
          <Button onClick={handleSave} className="w-full md:w-auto mt-4">
            {language === "id" ? "Simpan" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ESPSettings;
