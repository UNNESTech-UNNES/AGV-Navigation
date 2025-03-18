import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Hubungkan ke WebSocket Flask

export default function LampControl() {
  const [lampStatus, setLampStatus] = useState("off");

  // Fetch status lampu saat pertama kali komponen dimuat
  useEffect(() => {
    axios
      .get("http://localhost:5000/lamp")
      .then((response) => {
        setLampStatus(response.data.status);
      })
      .catch((error) => console.error("Error fetching lamp status:", error));

    // Listen event dari Flask-SocketIO untuk update status secara real-time
    socket.on("lamp_update", (data) => {
      setLampStatus(data.status);
    });

    return () => {
      socket.off("lamp_update"); // Bersihkan listener saat komponen di-unmount
    };
  }, []);

  // Fungsi untuk mengubah status lampu
  const toggleLamp = () => {
    const newStatus = lampStatus === "off" ? "on" : "off";
    axios
      .post("http://localhost:5000/lamp", { status: newStatus })
      .catch((error) => console.error("Error updating lamp status:", error));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">
        Lamp Status: {lampStatus.toUpperCase()}
      </h2>
      <Button
        onClick={toggleLamp}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
          lampStatus === "on"
            ? "bg-green-500 hover:bg-green-700"
            : "bg-gray-500 hover:bg-gray-700"
        }`}
      >
        {lampStatus === "on" ? "Turn Off" : "Turn On"}
      </Button>
    </div>
  );
}
