from flask import Flask, request, jsonify
from flask_cors import CORS
import threading  # for locking

app = Flask(__name__)
CORS(app)

# Store latest pool values (defaults)
pool_data = {
    "Tmer": 20.0,
    "Tzad": 20.0,
    "pHmer": 29.0,
    "Temp": 23.0,
    "orp": 22.0
}

# Lock for thread-safe updates
pool_lock = threading.Lock()

@app.route('/')
def home():
    return "Hello from Flask!"

# -----------------------------
# GET endpoint (read values)
# -----------------------------
@app.route('/api/jsmartPoolData', methods=['GET'])
def get_pool_data():
    with pool_lock:  # ensure consistent read if needed
        data_copy = pool_data.copy()
    return jsonify(data_copy), 200


# -----------------------------
# POST endpoint (update values)
# -----------------------------
@app.route('/api/jsmartPoolUpdate', methods=['POST'])
def update_pool_data():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No JSON provided"}), 400

    with pool_lock:  # lock during update
        for key in pool_data.keys():
            if key in data:
                try:
                    pool_data[key] = float(data[key])
                except (TypeError, ValueError):
                    return jsonify({"error": f"{key} must be a float"}), 400

        print("Updated pool data:", pool_data)
        response = {"status": "success", **pool_data}

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)