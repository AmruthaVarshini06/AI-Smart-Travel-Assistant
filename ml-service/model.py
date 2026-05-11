import random

class DelayPredictor:
    """
    A rule-based prediction model structured to be easily replaced 
    with a machine learning model (e.g., scikit-learn) in the future.
    """
    
    def __init__(self):
        # Base delays in minutes
        self.base_delays = {
            "flight": 5,
            "train": 10,
            "cab": 8,
            "bus": 15
        }
        
        # Multipliers for environmental factors
        self.weather_multipliers = {
            "clear": 1.0,
            "cloudy": 1.2,
            "rainy": 1.8
        }
        
        self.traffic_multipliers = {
            "low": 1.0,
            "medium": 1.4,
            "high": 2.2
        }

    def predict(self, mode, distance, weather, traffic_level):
        # 1. Get base delay for the mode
        base = self.base_delays.get(mode.lower(), 10)
        
        # 2. Apply weather impact
        weather_impact = self.weather_multipliers.get(weather.lower(), 1.0)
        
        # 3. Apply traffic impact
        traffic_impact = self.traffic_multipliers.get(traffic_level.lower(), 1.0)
        
        # 4. Distance factor (e.g., 1 minute extra per 100km)
        distance_factor = distance / 100.0
        
        # Calculate final prediction
        # Logic: (Base + Distance) * Weather * Traffic
        predicted_delay = (base + distance_factor) * weather_impact * traffic_impact
        
        # Round to 1 decimal place
        predicted_delay = round(predicted_delay, 1)
        
        # Generate a simulated confidence score (0.7 to 0.95)
        confidence = round(random.uniform(0.7, 0.95), 2)
        
        # Determine the primary reason
        reasons = []
        if traffic_impact > 1.5: reasons.append("heavy traffic congestion")
        if weather_impact > 1.5: reasons.append("adverse weather conditions")
        if distance > 500: reasons.append("long distance travel")
        
        reason = f"Delay primarily due to {', '.join(reasons)}." if reasons else "Normal transit conditions expected."
        
        return {
            "predicted_delay": predicted_delay,
            "confidence": confidence,
            "reason": reason
        }

# Singleton instance
predictor = DelayPredictor()