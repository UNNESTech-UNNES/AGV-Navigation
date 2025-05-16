import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Battery, Wifi, Navigation } from "lucide-react";
import roomsData from "../../data/data.json"; // Sesuaikan path sesuai struktur folder Anda

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [espIp, setEspIp] = useState(
    localStorage.getItem("espIp") || "192.168.2.119"
  );
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "id"
  );

  // States untuk AGV integration
  const [agvStatus, setAgvStatus] = useState("idle");
  const [currentLocation, setCurrentLocation] = useState("Titik START");
  const [currentLocationId, setCurrentLocationId] = useState(0); // Tambahkan state untuk ID lokasi
  const [obstacleDistance, setObstacleDistance] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isConnected, setIsConnected] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [encoderLeft, setEncoderLeft] = useState(0);
  const [encoderRight, setEncoderRight] = useState(0);
  const [isMoving, setIsMoving] = useState(false); // Tambahkan state untuk status gerakan
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [manualDistance, setManualDistance] = useState(100);
  const [manualRotation, setManualRotation] = useState(90);
  const [motorSpeed, setMotorSpeed] = useState(100);
  const [lastFetchStatus, setLastFetchStatus] = useState(""); // Untuk debugging
  const [arrivalNotificationChecked, setArrivalNotificationChecked] =
    useState(false);
  const [hasArrivedNotification, setHasArrivedNotification] = useState(false);

  // State untuk panel kedatangan
  const [showArrivalPanel, setShowArrivalPanel] = useState(false);
  const [availableDestinations, setAvailableDestinations] = useState([]);

  // Refs untuk status polling dan arrival polling
  const statusInterval = useRef(null);
  const arrivalInterval = useRef(null);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("lang") || "id");
    };
    window.addEventListener("languageChange", handleLangChange);

    console.log("Memulai polling status dengan IP:", espIp);
    // Mulai polling untuk status AGV
    startStatusPolling();

    return () => {
      window.removeEventListener("languageChange", handleLangChange);
      // Bersihkan interval saat komponen unmount
      if (statusInterval.current) {
        clearInterval(statusInterval.current);
        console.log("Status polling dihentikan");
      }
      if (arrivalInterval.current) {
        clearInterval(arrivalInterval.current);
        console.log("Arrival polling dihentikan");
      }
    };
  }, [espIp]);

  // Efek untuk memeriksa status kedatangan saat status AGV berubah menjadi "arrived"
  useEffect(() => {
    if (agvStatus === "arrived" && !arrivalNotificationChecked) {
      console.log("Status AGV arrived terdeteksi, cek notifikasi kedatangan");
      checkArrivalNotification();
      setArrivalNotificationChecked(true);

      // Mulai polling untuk notifikasi kedatangan
      startArrivalPolling();
    } else if (agvStatus !== "arrived") {
      // Reset status ketika AGV tidak lagi dalam status arrived
      setArrivalNotificationChecked(false);
      setHasArrivedNotification(false);
      setShowArrivalPanel(false);

      // Hentikan polling untuk arrival
      if (arrivalInterval.current) {
        clearInterval(arrivalInterval.current);
        arrivalInterval.current = null;
      }
    }
  }, [agvStatus]);

  // Efek untuk mempersiapkan panel navigasi saat notifikasi kedatangan diterima
  useEffect(() => {
    if (hasArrivedNotification) {
      console.log(
        "Notifikasi kedatangan diterima, siapkan panel navigasi lanjutan"
      );
      prepareNavigationOptions();
    }
  }, [hasArrivedNotification]);

  // Mulai polling berkala untuk status AGV
  const startStatusPolling = () => {
    if (statusInterval.current) {
      clearInterval(statusInterval.current);
      console.log("Menghapus interval polling sebelumnya");
    }

    // Lakukan polling awal segera
    fetchAgvStatus();

    // Poll setiap 2 detik
    statusInterval.current = setInterval(() => {
      console.log("Interval polling: memanggil fetchAgvStatus()");
      fetchAgvStatus();
    }, 2000);

    console.log("Status polling dimulai dengan interval 2 detik");
  };

  // Mulai polling untuk notifikasi kedatangan
  const startArrivalPolling = () => {
    if (arrivalInterval.current) {
      clearInterval(arrivalInterval.current);
    }

    // Poll setiap 3 detik, sedikit lebih lambat dari status polling
    arrivalInterval.current = setInterval(() => {
      console.log("Memeriksa notifikasi kedatangan");
      checkArrivalNotification();
    }, 3000);

    console.log("Arrival polling dimulai dengan interval 3 detik");
  };

  // Fungsi untuk mengambil status AGV dari ESP32
  const fetchAgvStatus = async () => {
    if (!espIp) {
      console.error("ESP IP tidak tersedia.");
      setLastFetchStatus("ESP IP tidak tersedia.");
      setIsConnected(false);
      return;
    }

    try {
      const url = `http://${espIp}/status`;
      console.log("Memulai fetch ke ESP32:", url);
      setLastFetchStatus("Mencoba koneksi...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout 5 detik

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Respons diterima:", response.status, response.statusText);
      setLastFetchStatus(`Respons: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const text = await response.text();
        console.log("Teks respons:", text);
        setLastFetchStatus(`Data diterima: ${text.substring(0, 30)}...`);

        try {
          const data = JSON.parse(text);
          console.log("Data JSON:", data);

          setAgvStatus(data.status || "idle");
          setCurrentLocation(data.location || "Unknown");
          setCurrentLocationId(data.location_id || 0);
          setObstacleDistance(data.obstacle_distance || 0);
          setBatteryLevel(data.battery || 100);
          setRotation(data.rotation || 0);
          setEncoderLeft(data.encoder_left || 0);
          setEncoderRight(data.encoder_right || 0);
          setIsMoving(data.is_moving === "true" || data.is_moving === true);
          setIsConnected(true);
          setLastFetchStatus("Sukses memperbarui data");
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          console.error("Teks yang gagal di-parse:", text);
          setIsConnected(false);
          setLastFetchStatus(`Error parsing JSON: ${parseError.message}`);
        }
      } else {
        console.warn("Menerima respons non-OK dari ESP32:", response.status);
        setIsConnected(false);
        setLastFetchStatus(
          `Error respons: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Fetch timeout setelah 5 detik");
        setLastFetchStatus("Timeout setelah 5 detik");
      } else {
        console.error("Error fetching AGV status:", error);
        setLastFetchStatus(`Error: ${error.message}`);
      }
      setIsConnected(false);
    }
  };

  // Fungsi untuk memeriksa notifikasi kedatangan
  const checkArrivalNotification = async () => {
    if (!espIp) {
      console.error("ESP IP tidak tersedia.");
      return;
    }

    try {
      const url = `http://${espIp}/arrival`;
      console.log("Memeriksa notifikasi kedatangan:", url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        console.log("Respons notifikasi:", text);

        try {
          const data = JSON.parse(text);
          console.log("Data notifikasi:", data);

          if (data.event === "arrival") {
            console.log("Notifikasi kedatangan diterima!");
            setHasArrivedNotification(true);
            setShowArrivalPanel(true);

            const locationName = data.location_name || "ruangan ini";
            const message =
              language === "id"
                ? `AGV telah sampai di ${locationName}`
                : `AGV has arrived at ${locationName}`;

            speak(message);
            alert("🎉 " + message);

            // Hentikan polling
            if (arrivalInterval.current) {
              clearInterval(arrivalInterval.current);
              arrivalInterval.current = null;
            }
          }
        } catch (parseError) {
          console.error("Error parsing arrival notification:", parseError);
        }
      } else {
        console.warn(
          `Respons tidak OK: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Fetch arrival timeout setelah 5 detik");
      } else {
        console.error("Error checking arrival notification:", error);
      }
    }
  };

  // Fungsi untuk menyiapkan opsi navigasi lanjutan
  const prepareNavigationOptions = () => {
    // Dapatkan ruangan-ruangan yang tersedia dari lokasi saat ini
    console.log(
      "Menyiapkan opsi navigasi lanjutan dari lokasi:",
      currentLocationId
    );

    // Filter ruangan-ruangan sesuai dengan lokasi saat ini
    const filteredRooms = roomsArray.filter((room) => {
      // Jangan tampilkan lokasi saat ini
      return room.command !== currentLocationId.toString();
    });

    setAvailableDestinations(filteredRooms);
    console.log("Destinasi tersedia:", filteredRooms);
  };

  // Reset notifikasi kedatangan di ESP32
  const resetArrivalNotification = async () => {
    if (!espIp) {
      console.error("ESP IP tidak tersedia.");
      return;
    }

    try {
      const url = `http://${espIp}/reset-arrival`;
      console.log("Reset notifikasi kedatangan:", url);

      const response = await fetch(url, { method: "GET" });

      if (response.ok) {
        console.log("Notifikasi kedatangan berhasil direset");
      } else {
        console.warn(
          `Gagal mereset notifikasi: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error resetting arrival notification:", error);
    }
  };

  // Data teks dalam dua bahasa
  const texts = {
    id: {
      title: "Daftar Ruangan",
      description: "Cari dan temukan ruangan yang Anda cari",
      guideMessage: (room) =>
        `Baik, Anda akan saya antar ke ${room.name}. ${room.description}`,
      guiding: "Menghantarkan Anda",
      statusTitle: "Status AGV",
      currentLocation: "Lokasi Saat Ini",
      obstacleDistance: "Jarak Halangan",
      batteryLevel: "Level Baterai",
      connected: "Terhubung",
      disconnected: "Terputus",
      connectionStatus: "Status Koneksi",
      settings: "Pengaturan",
      ipAddress: "Alamat IP ESP32",
      save: "Simpan",
      cancel: "Batal",
      status: {
        idle: "Siap",
        moving_forward: "Bergerak Maju",
        rotating: "Berputar",
        obstacle_detected: "Halangan Terdeteksi",
        running_route: "Menjalankan Rute",
        stopped_by_command: "Dihentikan",
        calibrating: "Kalibrasi",
        arrived: "Telah Sampai",
        returning_to_base: "Kembali ke START",
        stopped: "Berhenti",
      },
      manualControl: "Kontrol Manual",
      forward: "Maju",
      rotate: "Putar",
      stop: "Berhenti",
      reset: "Reset Encoder",
      calibrate: "Kalibrasi Gyro",
      distance: "Jarak",
      degrees: "Derajat",
      speed: "Kecepatan Motor",
      encoders: "Nilai Encoder",
      rotation: "Putaran",
      left: "Kiri",
      right: "Kanan",
      debugPanel: "Panel Debug",
      showDebug: "Tampilkan Debug",
      hideDebug: "Sembunyikan Debug",
      returnToDock: "Kembali ke START",
      guideMe: "Antar Saya",
      close: "Tutup",
      lastFetch: "Status Terakhir",
      reconnect: "Sambung Ulang",
      arrivedAt: "Telah sampai di",
      continueNavigation: "Ingin melanjutkan ke ruangan lain?",
      nextDestination: "Tujuan Selanjutnya",
    },
    en: {
      title: "Room List",
      description: "Find and discover the room you are looking for",
      guideMessage: (room) =>
        `Alright, I will guide you to ${room.name}. ${room.description}`,
      guiding: "Guiding you",
      statusTitle: "AGV Status",
      currentLocation: "Current Location",
      obstacleDistance: "Obstacle Distance",
      batteryLevel: "Battery Level",
      connected: "Connected",
      disconnected: "Disconnected",
      connectionStatus: "Connection Status",
      settings: "Settings",
      ipAddress: "ESP32 IP Address",
      save: "Save",
      cancel: "Cancel",
      status: {
        idle: "Idle",
        moving_forward: "Moving Forward",
        rotating: "Rotating",
        obstacle_detected: "Obstacle Detected",
        running_route: "Running Route",
        stopped_by_command: "Stopped",
        calibrating: "Calibrating",
        arrived: "Arrived",
        returning_to_base: "Returning to START",
        stopped: "Stopped",
      },
      manualControl: "Manual Control",
      forward: "Forward",
      rotate: "Rotate",
      stop: "Stop",
      reset: "Reset Encoder",
      calibrate: "Calibrate Gyro",
      distance: "Distance",
      degrees: "Degrees",
      speed: "Motor Speed",
      encoders: "Encoder Values",
      rotation: "Rotation",
      left: "Left",
      right: "Right",
      debugPanel: "Debug Panel",
      showDebug: "Show Debug",
      hideDebug: "Hide Debug",
      returnToDock: "Return to START",
      guideMe: "Guide Me",
      close: "Close",
      lastFetch: "Last Status",
      reconnect: "Reconnect",
      arrivedAt: "Arrived at",
      continueNavigation: "Continue to another room?",
      nextDestination: "Next Destination",
    },
  };

  // Konversi data JSON sesuai bahasa - Filter hanya untuk lantai 1
  const roomsArray = Object.entries(roomsData || {})
    .map(([key, room]) => ({
      id: key, // Gunakan key asli sebagai id
      name: language === "id" ? room.name : room.name_en,
      location: language === "id" ? room.location : room.location_en,
      description: language === "id" ? room.description : room.description_en,
      image: room.image || "https://via.placeholder.com/400x200",
      floor:
        room.location?.match(/Lantai (\d+)/)?.[1] ||
        room.location_en?.match(/(\d+)/)?.[1] ||
        "1",
      command: room.command, // Pastikan command diambil dari data
    }))
    .filter((room) => room.floor === "1"); // Filter hanya lantai 1

  const speak = (text) => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    if (window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = language === "id" ? "id-ID" : "en-US";
      speech.rate = 1;
      window.speechSynthesis.speak(speech);
    } else {
      console.warn("Speech synthesis not supported in this browser");
    }
  };

  const sendCommandToESP = async (command, params = {}) => {
    if (!espIp) {
      const errorMessage =
        language === "id"
          ? "Alamat IP ESP32 belum diatur."
          : "ESP32 IP address is not set.";
      alert(errorMessage);
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }

    try {
      // Validasi parameter tujuan untuk navigasi
      if (command === "navigasi" && params.tujuan !== undefined) {
        // Konversi tujuan ke angka
        const tujuanNumeric = parseInt(params.tujuan);
        if (isNaN(tujuanNumeric)) {
          console.error(
            `ERROR: Parameter tujuan bukan angka valid: ${params.tujuan}`
          );
          alert(
            language === "id"
              ? "Error: Parameter tujuan tidak valid"
              : "Error: Invalid tujuan parameter"
          );
          return { success: false, error: "Parameter tujuan tidak valid" };
        }

        // Gunakan tujuan yang sudah dikonversi
        params.tujuan = tujuanNumeric;
        console.log(`Mengirim perintah ${command} dengan parameter:`, params);
      } else if (
        command === "navigasi-antar" &&
        params.dari !== undefined &&
        params.ke !== undefined
      ) {
        // Konversi parameter dari dan ke menjadi angka
        const dariNumeric = parseInt(params.dari);
        const keNumeric = parseInt(params.ke);

        if (isNaN(dariNumeric) || isNaN(keNumeric)) {
          console.error("ERROR: Parameter dari/ke bukan angka valid");
          alert(
            language === "id"
              ? "Error: Parameter dari/ke tidak valid"
              : "Error: Invalid dari/ke parameter"
          );
          return { success: false, error: "Parameter dari/ke tidak valid" };
        }

        // Gunakan parameter yang sudah dikonversi
        params.dari = dariNumeric;
        params.ke = keNumeric;
        console.log(`Mengirim perintah ${command} dengan parameter:`, params);
      } else {
        console.log(`Mengirim perintah ${command} dengan parameter:`, params);
      }

      // Bangun URL dengan parameter
      let url = `http://${espIp}/${command}`;
      const queryParams = new URLSearchParams();

      Object.keys(params).forEach((key) => {
        queryParams.append(key, params[key]);
      });

      if (Object.keys(params).length > 0) {
        url += `?${queryParams.toString()}`;
      }

      console.log("URL perintah:", url);

      // Kirim request
      const response = await fetch(url, {
        method: "GET",
      });

      const text = await response.text();
      console.log("Respons perintah:", text);

      if (response.ok) {
        console.log(`Perintah ${command} berhasil dikirim ke ESP32`);

        // Tangani respons khusus
        if (text === "IZIN_LEWAT") {
          const permisiText =
            language === "id"
              ? "Mohon maaf, permisi, saya ingin lewat."
              : "Excuse me, I need to pass.";
          speak(permisiText);
          alert("🚶 " + permisiText);
        } else if (text === "TELAH_SAMPAI") {
          const sampaiText =
            language === "id"
              ? "Kita sudah sampai di tujuan."
              : "We have arrived at the destination.";
          speak(sampaiText);
          alert("🎉 " + sampaiText);
        }

        return { success: true, data: text };
      } else {
        const errorMessage =
          language === "id"
            ? "Gagal mengirim perintah ke ESP32."
            : "Failed to send command to ESP32.";
        alert(errorMessage);
        console.error(errorMessage, text);
        return { success: false, error: text };
      }
    } catch (error) {
      const errorMessage =
        language === "id"
          ? "Terjadi kesalahan saat mengirim ke ESP32."
          : "An error occurred while sending to ESP32.";
      alert(errorMessage);
      console.error("Error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleGuide = (room) => {
    // Debug log seluruh objek room untuk melihat struktur data
    console.log("DETAIL RUANGAN:", room);

    // Validasi command ada dan valid
    if (!room.command) {
      console.error("ERROR: Room tidak memiliki property command");
      alert(
        language === "id"
          ? "Error: Ruangan tidak memiliki perintah navigasi"
          : "Error: Room does not have navigation command"
      );
      return;
    }

    // Konversi command ke angka
    const commandValue = parseInt(room.command);
    console.log("Mengirim perintah navigasi ke ruangan:", commandValue);

    // Validasi command adalah angka
    if (isNaN(commandValue)) {
      console.error("ERROR: Command bukan angka valid:", room.command);
      alert(
        language === "id"
          ? "Error: Command ruangan tidak valid"
          : "Error: Room command is not valid"
      );
      return;
    }

    // Pastikan command dalam range yang diharapkan (0-6 untuk ESP32)
    if (commandValue < 0 || commandValue > 6) {
      console.warn("WARN: Command diluar range 0-6:", commandValue);
      // Tidak memberhentikan eksekusi, hanya warning
    }

    setLoading(true);
    setProgress(0);
    setSelectedRoom(room);
    speak(texts[language].guideMessage(room));

    let duration = 4000;
    let interval = 100;
    let step = 100 / (duration / interval);

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    // Kirim perintah setelah feedback suara dimulai
    setTimeout(() => {
      // Reset notifikasi kedatangan sebelum memulai navigasi baru
      resetArrivalNotification();

      // Kirim command yang sudah divalidasi
      sendCommandToESP("navigasi", { tujuan: commandValue })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error navigasi:", error);
          setLoading(false);
          alert(
            language === "id"
              ? "Gagal mengirim perintah navigasi"
              : "Failed to send navigation command"
          );
        });
    }, 1000);
  };

  // Fungsi untuk navigasi antar ruangan
  const handleContinueNavigation = (room) => {
    console.log("Melanjutkan navigasi ke:", room);

    // Validasi command ada dan valid
    if (!room.command) {
      console.error("ERROR: Room tidak memiliki property command");
      alert(
        language === "id"
          ? "Error: Ruangan tidak memiliki perintah navigasi"
          : "Error: Room does not have navigation command"
      );
      return;
    }

    // Konversi command ke angka
    const commandValue = parseInt(room.command);

    // Validasi command adalah angka
    if (isNaN(commandValue)) {
      console.error("ERROR: Command bukan angka valid:", room.command);
      alert(
        language === "id"
          ? "Error: Command ruangan tidak valid"
          : "Error: Room command is not valid"
      );
      return;
    }

    setLoading(true);
    setProgress(0);
    setSelectedRoom(room);
    speak(texts[language].guideMessage(room));

    // Tutup panel navigasi lanjutan
    setShowArrivalPanel(false);

    let duration = 4000;
    let interval = 100;
    let step = 100 / (duration / interval);

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    // Kirim perintah setelah feedback suara dimulai
    setTimeout(() => {
      // Reset notifikasi kedatangan sebelum memulai navigasi baru
      resetArrivalNotification();

      // Kirim navigasi antar ruangan menggunakan currentLocationId sebagai 'dari'
      sendCommandToESP("navigasi-antar", {
        dari: currentLocationId,
        ke: commandValue,
      })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error navigasi antar ruangan:", error);
          setLoading(false);
          alert(
            language === "id"
              ? "Gagal mengirim perintah navigasi antar ruangan"
              : "Failed to send inter-room navigation command"
          );
        });
    }, 1000);
  };

  // Fungsi kembali ke docking station
  const handleReturnToDock = () => {
    console.log("Mengirim perintah kembali ke Titik START");

    // Reset notifikasi kedatangan sebelum memulai navigasi baru
    resetArrivalNotification();

    sendCommandToESP("kembali")
      .then(() => {
        alert(
          language === "id"
            ? "AGV kembali ke Titik START"
            : "AGV returning to START"
        );

        // Tutup panel navigasi lanjutan jika sedang terbuka
        if (showArrivalPanel) {
          setShowArrivalPanel(false);
        }
      })
      .catch((error) => {
        console.error("Error kembali ke START:", error);
        alert(
          language === "id"
            ? "Gagal mengirim perintah kembali"
            : "Failed to send return command"
        );
      });
  };

  // Fungsi gerakan maju manual
  const handleMoveForward = () => {
    // Validasi distance adalah angka positif
    const distanceValue = parseInt(manualDistance);
    if (isNaN(distanceValue) || distanceValue <= 0) {
      alert(
        language === "id"
          ? "Jarak harus berupa angka positif"
          : "Distance must be a positive number"
      );
      return;
    }

    console.log("Mengirim perintah maju:", distanceValue);
    sendCommandToESP("forward", { distance: distanceValue })
      .then(() => {
        alert(
          language === "id"
            ? `Bergerak maju ${distanceValue} langkah`
            : `Moving forward ${distanceValue} steps`
        );
      })
      .catch((error) => {
        console.error("Error mengirim perintah maju:", error);
        alert(
          language === "id"
            ? "Gagal mengirim perintah maju"
            : "Failed to send forward command"
        );
      });
  };

  // Fungsi rotasi manual
  const handleRotate = () => {
    // Validasi rotation adalah angka
    const rotationValue = parseInt(manualRotation);
    if (isNaN(rotationValue)) {
      alert(
        language === "id"
          ? "Rotasi harus berupa angka"
          : "Rotation must be a number"
      );
      return;
    }

    console.log("Mengirim perintah putar:", rotationValue);
    sendCommandToESP("rotate", { degrees: rotationValue })
      .then(() => {
        alert(
          language === "id"
            ? `Berputar ${rotationValue} derajat`
            : `Rotating ${rotationValue} degrees`
        );
      })
      .catch((error) => {
        console.error("Error mengirim perintah putar:", error);
        alert(
          language === "id"
            ? "Gagal mengirim perintah putar"
            : "Failed to send rotate command"
        );
      });
  };

  // Fungsi perintah berhenti
  const handleStop = () => {
    console.log("Mengirim perintah stop");
    sendCommandToESP("stop").then(() => {
      alert(language === "id" ? "AGV dihentikan" : "AGV stopped");
    });
  };

  // Fungsi reset encoder
  const handleResetEncoders = () => {
    console.log("Mengirim perintah reset encoder");
    sendCommandToESP("reset").then(() => {
      alert(language === "id" ? "Encoder direset" : "Encoders reset");
    });
  };

  // Fungsi kalibrasi gyro
  const handleCalibrateGyro = () => {
    console.log("Mengirim perintah kalibrasi gyro");
    sendCommandToESP("calibrate").then(() => {
      alert(
        language === "id" ? "Gyroscope dikalibrasi" : "Gyroscope calibrated"
      );
    });
  };

  // Fungsi untuk mengubah kecepatan motor
  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setMotorSpeed(newSpeed);
    console.log("Mengubah kecepatan motor:", newSpeed);
    sendCommandToESP("kecepatan", { speed: newSpeed }).then(() => {
      console.log("Kecepatan motor diubah menjadi:", newSpeed);
    });
  };

  // Fungsi untuk menyimpan IP ESP32
  const handleSaveIp = () => {
    localStorage.setItem("espIp", espIp);
    setShowSettings(false);

    // Restart polling dengan IP baru
    startStatusPolling();

    alert(language === "id" ? "IP ESP32 disimpan" : "ESP32 IP saved");
  };

  // Fungsi untuk memaksa koneksi ulang
  const handleReconnect = () => {
    console.log("Memaksa koneksi ulang ke ESP32");
    fetchAgvStatus();
  };

  // Render antarmuka pengguna
  return (
    <div className="container mx-auto p-4">
      {/* Status Bar */}
      <div className="mb-4 p-2 bg-gray-100 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">
              {isConnected
                ? texts[language].connected
                : texts[language].disconnected}
            </span>
          </div>

          <div className="flex items-center">
            <Battery
              className={`w-5 h-5 mr-1 ${
                batteryLevel > 30 ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className="text-sm">{batteryLevel}%</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-sm bg-gray-200 px-2 py-1 rounded"
            >
              {texts[language].settings}
            </button>

            <button
              onClick={handleReconnect}
              className="text-sm bg-blue-100 px-2 py-1 rounded"
            >
              {texts[language].reconnect}
            </button>
          </div>
        </div>
      </div>

      {/* Panel Pengaturan */}
      {showSettings && (
        <div className="mb-4 p-3 bg-white rounded-lg shadow-md">
          <h3 className="font-medium mb-2">{texts[language].settings}</h3>
          <div className="flex flex-col">
            <label className="text-sm mb-1">{texts[language].ipAddress}</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={espIp}
                onChange={(e) => setEspIp(e.target.value)}
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                onClick={handleSaveIp}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                {texts[language].save}
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-300 px-2 py-1 rounded"
              >
                {texts[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel Status AGV */}
      <div className="mb-4 p-3 bg-white rounded-lg shadow-md">
        <h3 className="font-medium mb-2">{texts[language].statusTitle}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-600">
              {texts[language].currentLocation}:
            </p>
            <p className="font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-red-500" /> {currentLocation}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              {texts[language].status[agvStatus] || agvStatus}:
            </p>
            <p
              className={`font-medium ${
                agvStatus === "obstacle_detected" ? "text-red-500" : ""
              }`}
            >
              {agvStatus === "obstacle_detected" && (
                <AlertTriangle className="w-4 h-4 inline mr-1 text-red-500" />
              )}
              {texts[language].status[agvStatus] || agvStatus}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              {texts[language].obstacleDistance}:
            </p>
            <p className="font-medium">{obstacleDistance} cm</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              {texts[language].batteryLevel}:
            </p>
            <p className="font-medium flex items-center">
              <Battery
                className={`w-4 h-4 mr-1 ${
                  batteryLevel > 30 ? "text-green-500" : "text-red-500"
                }`}
              />
              {batteryLevel}%
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">{texts[language].rotation}:</p>
            <p className="font-medium flex items-center">
              <Navigation
                className="w-4 h-4 mr-1"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
              {rotation}°
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              {texts[language].connectionStatus}:
            </p>
            <p className="font-medium flex items-center">
              <Wifi
                className={`w-4 h-4 mr-1 ${
                  isConnected ? "text-green-500" : "text-red-500"
                }`}
              />
              {isConnected
                ? texts[language].connected
                : texts[language].disconnected}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleReturnToDock}
            className="flex-1 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg flex items-center justify-center"
          >
            <Navigation className="w-4 h-4 mr-1" />
            {texts[language].returnToDock}
          </button>
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg"
          >
            {showDebugPanel
              ? texts[language].hideDebug
              : texts[language].showDebug}
          </button>
        </div>
      </div>

      {/* Panel Debug */}
      {showDebugPanel && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg shadow-md">
          <h3 className="font-medium mb-2">{texts[language].debugPanel}</h3>

          <div className="mb-3">
            <p className="text-sm text-gray-600">{texts[language].encoders}:</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-white p-2 rounded">
                <span className="text-sm text-gray-600">
                  {texts[language].left}:
                </span>
                <span className="ml-2 font-medium">{encoderLeft}</span>
              </div>
              <div className="bg-white p-2 rounded">
                <span className="text-sm text-gray-600">
                  {texts[language].right}:
                </span>
                <span className="ml-2 font-medium">{encoderRight}</span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">
              {texts[language].manualControl}:
            </p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="bg-white p-2 rounded flex flex-col">
                <label className="text-sm text-gray-600">
                  {texts[language].distance}:
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={manualDistance}
                    onChange={(e) => setManualDistance(e.target.value)}
                    className="w-16 border px-1 py-0.5 rounded"
                  />
                  <button
                    onClick={handleMoveForward}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    {texts[language].forward}
                  </button>
                </div>
              </div>

              <div className="bg-white p-2 rounded flex flex-col">
                <label className="text-sm text-gray-600">
                  {texts[language].degrees}:
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={manualRotation}
                    onChange={(e) => setManualRotation(e.target.value)}
                    className="w-16 border px-1 py-0.5 rounded"
                  />
                  <button
                    onClick={handleRotate}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    {texts[language].rotate}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600">{texts[language].speed}:</p>
            <input
              type="range"
              min="50"
              max="255"
              value={motorSpeed}
              onChange={handleSpeedChange}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>50</span>
              <span>{motorSpeed}</span>
              <span>255</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleStop}
              className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-lg"
            >
              {texts[language].stop}
            </button>
            <button
              onClick={handleResetEncoders}
              className="flex-1 bg-gray-300 px-3 py-1.5 rounded-lg"
            >
              {texts[language].reset}
            </button>
            <button
              onClick={handleCalibrateGyro}
              className="flex-1 bg-gray-300 px-3 py-1.5 rounded-lg"
            >
              {texts[language].calibrate}
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            <p>
              {texts[language].lastFetch}: {lastFetchStatus}
            </p>
          </div>
        </div>
      )}

      {/* Panel Kedatangan */}
      {showArrivalPanel && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg shadow-md">
          <h3 className="font-medium mb-2">
            {texts[language].arrivedAt} {currentLocation}
          </h3>
          <p className="mb-3">{texts[language].continueNavigation}</p>

          <div className="grid grid-cols-1 gap-2 mt-3">
            {availableDestinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleContinueNavigation(dest)}
                className="bg-white p-3 rounded-lg shadow-sm hover:bg-blue-50 transition flex items-center"
              >
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                <div className="text-left">
                  <p className="font-medium">{dest.name}</p>
                  <p className="text-sm text-gray-600">{dest.location}</p>
                </div>
              </button>
            ))}

            <button
              onClick={handleReturnToDock}
              className="mt-2 bg-blue-100 text-blue-800 p-3 rounded-lg flex items-center justify-center"
            >
              <Navigation className="w-5 h-5 mr-2" />
              {texts[language].returnToDock}
            </button>

            <button
              onClick={() => setShowArrivalPanel(false)}
              className="mt-1 bg-gray-200 p-2 rounded-lg"
            >
              {texts[language].close}
            </button>
          </div>
        </div>
      )}

      {/* Room List UI */}
      <div className="p-3 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-1">{texts[language].title}</h2>
        <p className="text-gray-600 mb-4">{texts[language].description}</p>

        {/* Tampilkan pesan loading */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-4/5 max-w-md">
              <h3 className="text-lg font-bold mb-2">
                {texts[language].guiding} {selectedRoom?.name}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {selectedRoom?.description}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {roomsArray.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="p-3">
                <h3 className="font-medium">{room.name}</h3>
                <p className="text-sm text-gray-600">{room.location}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {room.description}
                  </p>
                  <button
                    onClick={() => handleGuide(room)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    {texts[language].guideMe}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
