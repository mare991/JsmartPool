from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app)

# Store latest pool values (defaults)
pool_data = {
    "Tmer": 0.0,
    "Tzad": 0.0,
    "pHmer": 0.0,
    "Temp": 0.0,
    "orp": 0.0
}

@app.route('/')
def home():
    return "Hello from Flask!"

# -----------------------------
# GET endpoint (read values)
# -----------------------------
@app.route('/api/jsmartPoolData', methods=['GET'])
def get_pool_data():
    return jsonify(pool_data), 200


# -----------------------------
# POST endpoint (update values)
# -----------------------------
@app.route('/api/jsmartPoolUpdate', methods=['POST'])
def update_pool_data():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No JSON provided"}), 400

    # Validate and update floats
    for key in pool_data.keys():
        if key in data:
            try:
                pool_data[key] = float(data[key])
            except (TypeError, ValueError):
                return jsonify({
                    "error": f"{key} must be a float"
                }), 400

    print("Updated pool data:", pool_data)

    return jsonify({
        "status": "success",
        **pool_data
    }), 200


if _name_ == "_main_":
    app.run(host='0.0.0.0', port=5000, debug=True
