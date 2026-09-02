import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Load dataset
data = pd.read_csv("dataset.csv")

# Convert date
data["date"] = pd.to_datetime(data["date"])

# Create time features
data["day"] = data["date"].dt.day
data["month"] = data["date"].dt.month
data["day_of_week"] = data["date"].dt.dayofweek

# Features and target
features = [
    "day",
    "month",
    "day_of_week",
    "price_per_kg"
]

X = data[features]
y = data["demand_kg"]

# Train AI model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)

# Last date
last_date = data["date"].max()

# Average recent demand
recent_demand = data["demand_kg"].tail(7).mean()

print("\n==========================================")
print("        FARM DIRECT AI FORECAST")
print("==========================================")

print(f"\nCrop: Tomato")
print(f"Current average demand: {recent_demand:.0f} kg/day")

print("\n7-Day Demand Forecast")
print("------------------------------------------")

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

    predictions.append(prediction)

    print(
        f"{future_date.strftime('%d-%b')} : "
        f"{prediction:.0f} kg"
    )

# Average predicted demand
average_prediction = sum(predictions) / len(predictions)

# Determine demand level
if average_prediction > recent_demand * 1.10:
    demand_level = "HIGH"
    recommendation = "Increase tomato supply."

elif average_prediction < recent_demand * 0.90:
    demand_level = "LOW"
    recommendation = "Reduce tomato supply."

else:
    demand_level = "MEDIUM"
    recommendation = "Maintain current tomato supply."

print("\n==========================================")
print(f"Demand Level: {demand_level}")
print(f"Average predicted demand: {average_prediction:.0f} kg/day")
print(f"Recommendation: {recommendation}")
print("==========================================\n")