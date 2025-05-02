import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  StopCircle,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

const firebaseURL = "https://agv-testing-default-rtdb.asia-southeast1.firebasedatabase.app";
const firebaseAuth = "fzys9UGLDVQmMR31lWWf9oUlF1XcHLqRLpWG03Oi";

const AGVControl = () => {
  const [status, setStatus] = useState("Unknown");
  const [sensorData, setSensorData] = useState({
    encoder1: 0,
    encoder2: 0,
    distance: 0
  });
  
  // Send command to Firebase
  const sendCommand = async (commandValue) => {
    try {
      const response = await fetch(${firebaseURL}/command.json?auth=${firebaseAuth}, {
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
  
  // Fetch sensor data and AGV status from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch AGV status
        const statusResponse = await fetch(${firebaseURL}/agv/status.json?auth=${firebaseAuth});
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setStatus(statusData || "Unknown");
        }
        
        // Fetch sensor data
        const sensorResponse = await fetch(${firebaseURL}/agv/sensor_data.json?auth=${firebaseAuth});
        if (sensorResponse.ok) {
          const data = await sensorResponse.json();
          if (data) {
            setSensorData({
              encoder1: data.encoder1 || 0,
              encoder2: data.encoder2 || 0,
              distance: data.distance || 0
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Initialize fetch
    fetchData();
    
    // Set up interval for fetching data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-6 text-center">
      {/* Status and Sensor Display */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
          <Activity size={20} />
          AGV Status: <span className="font-bold text-blue-600">{status}</span>
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded shadow">
            <h3 className="font-medium">Encoder 1</h3>
            <p className="text-2xl font-bold">{sensorData.encoder1}</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <h3 className="font-medium">Encoder 2</h3>
            <p className="text-2xl font-bold">{sensorData.encoder2}</p>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <h3 className="font-medium">Distance (cm)</h3>
            <p className="text-2xl font-bold">{sensorData.distance}</p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <h2 className="text-xl font-semibold mb-6">Control AGV</h2>

      {/* Direction buttons arrangement */}
      <div className="flex justify-center gap-8 mb-4">
        <Button
          variant="outline"
          onClick={() => sendCommand(1)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200"
        >
          <ArrowUp size={24} />
        </Button>
      </div>
      <div className="flex justify-center items-center gap-8 mb-4">
        <Button
          variant="outline"
          onClick={() => sendCommand(3)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200"
        >
          <ArrowLeft size={24} />
        </Button>
        {/* Stop button */}
        <Button
          variant="outline"
          onClick={() => sendCommand(5)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
        >
          <StopCircle size={24} />
        </Button>
        <Button
          variant="outline"
          onClick={() => sendCommand(4)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200"
        >
          <ArrowRight size={24} />
        </Button>
      </div>
      <div className="flex justify-center gap-8">
        <Button
          variant="outline"
          onClick={() => sendCommand(2)}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200"
        >
          <ArrowDown size={24} />
        </Button>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold mb-4">Control Legend:</h3>
        <ul className="list-none space-y-2">
          <li className="flex items-center justify-center gap-2">
            <ArrowUp size={18} />
            <span>Forward / Command 1</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <ArrowDown size={18} />
            <span>Backward / Command 2</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            <span>Left / Command 3</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <ArrowRight size={18} />
            <span>Right / Command 4</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <StopCircle size={18} />
            <span>Stop / Command 5</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AGVControl;