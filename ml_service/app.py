from flask import Flask, request, jsonify

app = Flask(__name__)


def simulate_delay_prediction(route_id: str, weather: str = 'Clear') -> dict:
    seed = sum(ord(c) for c in route_id)
    base_delay = 8 + (seed % 18)
    weather_penalty = 22 if weather == 'Storm' else 12 if weather == 'Rain' else 5
    predicted_delay = base_delay + weather_penalty

    probability = min(100, 40 + (seed % 38) + (weather_penalty / 2))
    confidence = round(0.78 + ((seed % 15) / 100), 2)

    return {
        'routeId': route_id,
        'predictedDelayMinutes': int(predicted_delay),
        'probability': round(probability, 2),
        'confidence': confidence,
        'factors': ['Weather impact', 'Historical delay patterns', 'Transfer complexity'],
    }


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ML Delay Predictor'})


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True, silent=True) or {}
    route_id = data.get('routeId', 'r1')
    weather = data.get('weather', 'Clear')

    prediction = simulate_delay_prediction(route_id, weather)
    return jsonify(prediction)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
