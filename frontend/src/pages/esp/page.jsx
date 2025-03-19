import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";

const ESPControl = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ambil IP dari localStorage saat komponen dimuat
    const savedIP = localStorage.getItem("esp_ip") || "192.168.4.1";
    setIpAddress(savedIP);
  }, []);

  const handleSaveIP = () => {
    localStorage.setItem("esp_ip", ipAddress);
    alert(`IP ESP32 disimpan: ${ipAddress}`);
  };

  const handleTestESP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://${ipAddress}/test`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Gagal menghubungi ESP32");
      alert("Perintah berhasil dikirim ke ESP32!");
    } catch (error) {
      alert("Gagal mengirim perintah. Periksa koneksi dan IP ESP32.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto ">
      <Header
        title="Cari Ruangan"
        description="Tekan tombol dan ucapkan nama ruangan yang anda cari"
        variant="secondary"
      />
      <h2 className="text-xl font-bold mt-4">ESP32 Control</h2>
      <label className="block mb-2">IP Address ESP32:</label>
      <Input
        type="text"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSaveIP} className="w-full mb-2">
        Simpan IP
      </Button>
      <Button onClick={handleTestESP} className="w-full" disabled={isLoading}>
        {isLoading ? "Mengirim..." : "Testing"}
      </Button>
    </div>
  );
};

export default ESPControl;
