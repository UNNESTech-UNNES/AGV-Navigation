from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

ESP32_IP = "http://192.168.159.119"  # Ganti dengan IP ESP32 kamu

@app.route('/send', methods=['POST'])
def send_command():
    try:
        data = request.json
        command = data.get("command", "")

        if command:
            response = requests.post(f"{ESP32_IP}/command", data=str(command))
            return jsonify({"status": "success", "command_sent": command, "response": response.text})
        else:
            return jsonify({"status": "error", "message": "No command provided"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
