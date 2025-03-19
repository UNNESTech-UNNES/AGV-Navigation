import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { toast } from "sonner";

const ESPSettings = () => {
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
      toast.success("Alamat IP ESP32 berhasil diperbarui.");
    } else {
      toast.error(
        "Format alamat IP tidak valid. Mohon masukkan IP yang benar."
      );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <Header
        title="Pengaturan ESP32"
        description="Atur alamat IP ESP32 untuk komunikasi"
        variant="secondary"
      />

      <div className="w-full max-w-lg  rounded-lg p-4 md:p-6 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Alamat IP ESP32</label>
          <Input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="192.168.x.x"
            className="w-full"
            aria-label="Alamat IP ESP32"
          />
          <Button onClick={handleSave} className="w-full md:w-auto mt-4">
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ESPSettings;
