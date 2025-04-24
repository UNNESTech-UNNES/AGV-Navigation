import React from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const firebaseURL =
  "https://agv-testing-default-rtdb.asia-southeast1.firebasedatabase.app/command.json?auth=fzys9UGLDVQmMR31lWWf9oUlF1XcHLqRLpWG03Oi";

const CommandControl = () => {
  const sendCommand = async (commandValue) => {
    try {
      const response = await fetch(firebaseURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commandValue),
      });

      if (!response.ok) {
        throw new Error("Failed to send command");
      }

      console.log("Command sent:", commandValue);
    } catch (error) {
      console.error("Error sending command:", error);
    }
  };

  return (
    <div className="p-6 text-center mt-16">
      <h2 className="text-xl font-semibold mb-6">Kontrol AGV</h2>

      {/* Susunan tombol dengan + dan Stop */}
      <div className="flex justify-center gap-8 mb-4">
        <Button
          variant="outline"
          onClick={() => sendCommand(1)}
          className="w-16 h-16 rounded-full flex items-center justify-center"
        >
          <ArrowUp size={24} />
        </Button>
      </div>
      <div className="flex justify-center items-center gap-8 mb-4">
        <Button
          variant="outline"
          onClick={() => sendCommand(3)}
          className="w-16 h-16 rounded-full flex items-center justify-center"
        >
          <ArrowLeft size={24} />
        </Button>
        {/* Tombol Stop di tengah */}
        <Button
          variant="outline"
          onClick={() => sendCommand(5)} // Perintah Stop
          className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-900 hover:text-white"
        >
          <StopCircle size={24} />
        </Button>
        <Button
          variant="outline"
          onClick={() => sendCommand(4)}
          className="w-16 h-16 rounded-full flex items-center justify-center"
        >
          <ArrowRight size={24} />
        </Button>
      </div>
      <div className="flex justify-center gap-8">
        <Button
          variant="outline"
          onClick={() => sendCommand(2)}
          className="w-16 h-16 rounded-full flex items-center justify-center"
        >
          <ArrowDown size={24} />
        </Button>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-xl font-semibold mb-4">Legend:</h1>
        <ul className="list-none space-y-3">
          <li className="flex items-center justify-center gap-2">
            <ArrowUp size={20} />
            <span>Maju / Command 1</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <ArrowDown size={20} />
            <span>Mundur / Command 2</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <ArrowLeft size={20} />
            <span>Kiri / Command 3</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <ArrowRight size={20} />
            <span>Kanan / Command 4</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <StopCircle size={20} />
            <span>Berhenti / Command 5</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommandControl;
