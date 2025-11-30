from flask import Flask,request,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Store the latest temperature and pH values (initialize with default values)
pool_data = {
    "temperature": 28,
    "ph": 6.89
}

@app.route('/')
def home():
    return "Hello from Flask!"

@app.route('/api/greet')
def greet():
    return {"message": "Hello from /api/greet!"}

@app.route('/api/jsmartpoolData',methods=['GET','POST'])
def jsmartpoolData():
    if request.method=='GET':
        # Return the stored temperature and pH values (always return consistent structure)
        return jsonify({
            "temperature": pool_data["temperature"],
            "ph": pool_data["ph"]
        }), 200
    
    # Handle POST request
    data=request.get_json(silent=True)
    if not data:
        return jsonify({"error":"No JSON provided"}),400

    temperature=data.get("temperature")
    ph=data.get("ph")

    if temperature is None or ph is None:
        return jsonify({"error":"Missing temperature or ph field"}),400

    # Store the values
    pool_data["temperature"] = temperature
    pool_data["ph"] = ph

    print("Received data:",data)

    return jsonify({
        "status":"success",
        "temperature":temperature,
        "ph":ph
    }), 200
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
