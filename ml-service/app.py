from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predictor

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/predict-delay', methods=['POST'])
def predict_delay():
    data = request.get_json()
    
    # 1. Validation: Check for missing fields
    required_fields = ["mode", "distance", "weather", "traffic_level"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
            
    # 2. Validation: Check data types and values
    try:
        mode = str(data['mode']).lower()
        distance = float(data['distance'])
        weather = str(data['weather']).lower()
        traffic_level = str(data['traffic_level']).lower()
        
        if mode not in ["flight", "train", "bus", "cab"]:
            return jsonify({"error": "Invalid mode. Must be flight, train, bus, or cab."}), 400
            
        if weather not in ["clear", "rainy", "cloudy"]:
            return jsonify({"error": "Invalid weather. Must be clear, rainy, or cloudy."}), 400
            
        if traffic_level not in ["low", "medium", "high"]:
            return<dyad-write path="ml-service/app.py" description="Completing the Flask application entry point with full validation and error handling.">
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predictor

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/predict-delay', methods=['POST'])
def predict_delay():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # 1. Validation: Check for missing fields
    required_fields = ["mode", "distance", "weather", "traffic_level"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
            
    # 2. Validation: Check data types and values
    try:
        mode = str(data['mode']).lower()
        distance = float(data['distance'])
        weather = str(data['weather']).lower()
        traffic_level = str(data['traffic_level']).lower()
        
        valid_modes = ["flight", "train", "bus", "cab"]
        if mode not in valid_modes:
            return jsonify({"error": f"Invalid mode. Must be one of: {', '.join(valid_modes)}"}), 400
            
        valid_weather = ["clear", "rainy", "cloudy"]
        if weather not in valid_weather:
            return jsonify({"error": f"Invalid weather. Must be one of: {', '.join(valid_weather)}"}), 400
            
        valid_traffic = ["low", "medium", "high"]
        if traffic_level not in valid_traffic:
            return jsonify({"error": f"Invalid traffic_level. Must be one of: {', '.join(valid_traffic)}"}), 400
            
        if distance < 0:
            return jsonify({"error": "Distance cannot be negative"}), 400

        # 3. Perform Prediction
        result = predictor.predict(mode, distance, weather, traffic_level)
        return jsonify(result), 200

    except ValueError:
        return jsonify({"error": "Invalid data format. Distance must be a number."}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == '__main__':
    # Running on port 5001 as requested
    app.run(host='0.0.0.0', port=5001, debug=True)