from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)
CORS(app)

# Load dataset
data = pd.read_csv("dataset.csv")
data["date"] = pd.to_datetime(data["date"])

# Create time features
data["day"] = data["date"].dt.day
data["month"] = data["date"].dt.month
data["day_of_week"] = data["date"].dt.dayofweek

features = [
    "day",
    "month",
    "day_of_week",
    "price_per_kg"
]

X = data[features]
y = data["demand_kg"]

# Train model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)


@app.route("/")
def home():
    return jsonify({
        "message": "FarmDirect AI API is running"
    })


@app.route("/api/forecast")
def forecast():

    last_date = data["date"].max()
    recent_demand = data["demand_kg"].tail(7).mean()

    predictions = []

    for i in range(1, 8):

        future_date = last_date + pd.Timedelta(days=i)

        future_data = pd.DataFrame({
            "day": [future_date.day],
            "month": [future_date.month],
            "day_of_week": [future_date.dayofweek],
            "price_per_kg": [20]
        })

        prediction = model.predict(future_data)[0]
        prediction = max(0, prediction)

        predictions.append(round(prediction))

    average_prediction = round(
        sum(predictions) / len(predictions)
    )

    if average_prediction > recent_demand * 1.10:
        demand_level = "HIGH"
        recommendation = "Increase tomato supply."

    elif average_prediction < recent_demand * 0.90:
        demand_level = "LOW"
        recommendation = "Reduce tomato supply."

    else:
        demand_level = "MEDIUM"
        recommendation = "Maintain current tomato supply."

    return jsonify({
        "crop": "Tomato",
        "current_average_demand": round(recent_demand),
        "forecast": predictions,
        "average_predicted_demand": average_prediction,
        "demand_level": demand_level,
        "recommendation": recommendation
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)