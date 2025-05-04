import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  StopCircle,
  RotateCcw,
  Activity,
  Wifi,
  WifiOff,
  PlayCircle,
  Settings,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const AGVControl = () => {
  const [esp32IP, setEsp32IP] = useState("192.168.204.119");
  const [status, setStatus] = useState("Disconnected");
  const [sensorData, setSensorData] = useState({
    encoder1: 0,
    encoder2: 0,
    distance: 0,
    speed: 200,
  });
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [motorSpeed, setMotorSpeed] = useState(200);
  const [connectionError, setConnectionError] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [obstacleDetected, setObstacleDetected] = useState(false);

  const buttonStyle =
    "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center";
  const cardStyle =
    "p-4 mb-4 bg-gray-50 rounded-lg shadow border border-gray-200";
  const sensorCardStyle =
    "p-3 bg-white rounded border shadow-sm flex flex-col items-center";

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  const fetchData = async () => {
    if (!esp32IP) return;
    try {
      const timestamp = new Date();
      const response = await fetch(
        `http://${esp32IP}/sensor_data?_=${timestamp.getTime()}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSensorData({
        encoder1: data.encoder1 || 0,
        encoder2: data.encoder2 || 0,
        distance: data.distance || 0,
        speed: data.speed || 200,
      });
      setStatus(data.status || "Ready");
      setConnected(true);
      setConnectionError("");
      setLastUpdate(formatTime(new Date()));
      setObstacleDetected(data.distance > 0 && data.distance <= 10);
    } catch (error) {
      console.error("Error fetching data:", error);
      setConnected(false);
      setConnectionError(`Cannot connect to ESP32 at ${esp32IP}`);
      setStatus("Disconnected");
    }
  };

  const sendCommand = async (command) => {
    if (!connected) {
      setConnectionError("Not connected to ESP32");
      return false;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://${esp32IP}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `cmd=${command}&speed=${motorSpeed}`,
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setConnectionError("");
      setLastUpdate(formatTime(new Date()));
      switch (command) {
        case "forward":
          setStatus("Moving Forward");
          break;
        case "backward":
          setStatus("Moving Backward");
          break;
        case "left":
          setStatus("Turning Left");
          break;
        case "right":
          setStatus("Turning Right");
          break;
        case "stop":
          setStatus("Stopped");
          break;
        case "reset":
          setStatus("Encoders Reset");
          break;
        default:
          break;
      }
      await fetchData();
      return true;
    } catch (error) {
      console.error("Error sending command:", error);
      setConnectionError(`Command failed: ${error.message}`);
      setConnected(false);
      setStatus("Connection Error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testMotors = async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const response = await fetch(`http://${esp32IP}/test_motors`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setStatus("Testing motors...");
      setConnectionError("");
      setTimeout(fetchData, 8000);
    } catch (error) {
      console.error("Error testing motors:", error);
      setConnectionError(`Test failed: ${error.message}`);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeedChange = async (e) => {
    const newSpeed = parseInt(e.target.value);
    if (!isNaN(newSpeed)) {
      setMotorSpeed(newSpeed);
      await sendCommand("speed");
    }
  };

  useEffect(() => {
    if (esp32IP) {
      const interval = setInterval(() => {
        if (connected) {
          fetchData();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [esp32IP, connected]);

  return (
    <div className="p-4 max-w-md mx-auto mt-24">
      <div
        className={`p-3 mb-4 rounded-lg flex flex-col items-center gap-2 ${
          connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        } ${obstacleDetected ? "border-2 border-yellow-400" : ""}`}
      >
        <div className="flex items-center gap-2">
          {connected ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span className="font-medium">
            {connected ? "Connected" : "Disconnected"}
          </span>
          {obstacleDetected && (
            <span className="flex items-center gap-1 text-yellow-700">
              <AlertCircle size={16} />
              Obstacle Detected!
            </span>
          )}
        </div>
        <div className="text-sm">
          {lastUpdate && connected && `Last update: ${lastUpdate}`}
        </div>
        {connectionError && (
          <div className="flex items-center gap-1 text-sm">
            <AlertCircle size={14} />
            <span>{connectionError}</span>
          </div>
        )}
      </div>

      <div className={cardStyle}>
        <label className="block mb-2 font-medium">ESP32 IP Address:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={esp32IP}
            onChange={(e) => setEsp32IP(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Enter ESP32 IP"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className={`${buttonStyle} ${
              connected
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {loading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : connected ? (
              "Refresh"
            ) : (
              "Connect"
            )}
          </button>
        </div>
      </div>

      <div className={cardStyle}>
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Activity size={20} className="text-blue-500" />
          <span>
            AGV Status: <span className="font-bold">{status}</span>
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {["encoder1", "encoder2", "distance", "speed"].map((key) => (
            <div key={key} className={sensorCardStyle}>
              <h3 className="font-medium text-gray-600">
                {key === "encoder1" && "Encoder 1"}
                {key === "encoder2" && "Encoder 2"}
                {key === "distance" && "Distance (cm)"}
                {key === "speed" && "Speed"}
              </h3>
              <p
                className={`text-2xl font-bold ${
                  key === "distance"
                    ? sensorData.distance <= 10
                      ? "text-red-600"
                      : "text-green-600"
                    : key === "speed"
                    ? "text-purple-600"
                    : "text-blue-600"
                }`}
              >
                {typeof sensorData[key] === "number"
                  ? sensorData[key].toFixed(1)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={cardStyle}>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Settings size={18} className="text-purple-500" />
          Motor Speed Control
        </h2>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-gray-500">0</span>
          <input
            type="range"
            min="0"
            max="255"
            value={motorSpeed}
            onChange={handleSpeedChange}
            className="flex-1"
            disabled={!connected || loading}
          />
          <span className="text-sm text-gray-500">255</span>
        </div>
        <div className="text-center font-medium">
          Current Speed: <span className="text-purple-600">{motorSpeed}</span>
        </div>
      </div>

      <div className={cardStyle}>
        <h2 className="text-xl font-semibold mb-4">Control AGV</h2>
        <div className="flex flex-col items-center gap-2 mb-4">
          <button
            onClick={() => sendCommand("forward")}
            disabled={!connected || loading || obstacleDetected}
            className={`${buttonStyle} ${
              !connected || loading || obstacleDetected
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white w-16 h-16 rounded-full`}
          >
            <ArrowUp size={24} />
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => sendCommand("left")}
              disabled={!connected || loading || obstacleDetected}
              className={`${buttonStyle} ${
                !connected || loading || obstacleDetected
                  ? "bg-gray-300"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white w-16 h-16 rounded-full`}
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={() => sendCommand("stop")}
              disabled={!connected || loading}
              className={`${buttonStyle} ${
                !connected || loading
                  ? "bg-gray-300"
                  : "bg-red-500 hover:bg-red-600"
              } text-white w-16 h-16 rounded-full`}
            >
              <StopCircle size={24} />
            </button>
            <button
              onClick={() => sendCommand("right")}
              disabled={!connected || loading || obstacleDetected}
              className={`${buttonStyle} ${
                !connected || loading || obstacleDetected
                  ? "bg-gray-300"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white w-16 h-16 rounded-full`}
            >
              <ArrowRight size={24} />
            </button>
          </div>
          <button
            onClick={() => sendCommand("backward")}
            disabled={!connected || loading || obstacleDetected}
            className={`${buttonStyle} ${
              !connected || loading || obstacleDetected
                ? "bg-gray-300"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white w-16 h-16 rounded-full`}
          >
            <ArrowDown size={24} />
          </button>
        </div>
        <button
          onClick={testMotors}
          disabled={!connected || loading}
          className={`${buttonStyle} ${
            !connected || loading
              ? "bg-gray-300"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-white w-full`}
        >
          <RotateCcw size={18} className="mr-2" />
          Test Motors
        </button>
      </div>
    </div>
  );
};

export default AGVControl;
