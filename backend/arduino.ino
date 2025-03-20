#include <WiFi.h>
#include <WebServer.h>
  
const char* ssid = "TEKNIK_ASIK";
const char* password = "minimalbayar";

WebServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  Serial.print("Menghubungkan ke WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nTerhubung ke WiFi!");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  server.on("/command", HTTP_POST, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (server.method() == HTTP_OPTIONS) {
      server.send(204);
      return;
    }
    
    if (server.hasArg("plain")) {
      String command = server.arg("plain");
      Serial.println("Perintah diterima: " + command);
      handleCommand(command.toInt());
      server.send(200, "text/plain", "OK");
    } else {
      server.send(400, "text/plain", "No command received");
    }
  });

  server.begin();
}

void loop() {
  server.handleClient();
}

void handleCommand(int command) {
  switch (command) {
    case 1:
      Serial.println("Menuju Ruang 1A: Terletak di sebelah lobi.");
      break;
    case 2:
      Serial.println("Menuju Ruang 1B: Terletak di depan tangga lantai 1.");
      break;
    case 3:
      Serial.println("Menuju Ruang Administrasi: Terletak di sisi kanan ujung koridor, setelah melewati ruang 1B.");
      break;
    case 4:
      Serial.println("Menuju Ruang Rapat 1: Terletak di sisi kiri setelah tangga lantai 1 dan berada di depan ruang 1B.");
      break;
    case 5:
      Serial.println("Menuju Ruang Humas: Terletak di sisi kiri ujung koridor dan depan ruang administrasi.");
      break;
    case 6:
      Serial.println("Menuju Toilet Wanita: Terletak di belakang gedung, setelah ruang administrasi.");
      break;
    case 7:
      Serial.println("Menuju Toilet Pria: Terletak di belakang gedung, setelah ruang administrasi.");
      break;
    case 8:
      Serial.println("Menuju Lift 1: Terletak di depan pintu masuk gedung.");
      break;
    case 9:
      Serial.println("Menuju Tangga 1: Terletak di sebelah kiri pintu masuk gedung.");
      break;
    default:
      Serial.println("Perintah tidak dikenali.");
  }
}