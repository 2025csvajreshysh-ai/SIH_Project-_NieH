import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Load dataset
data = pd.read_csv("dataset.csv")

# Convert date
data["date"] = pd.to_datetime(data["date"])

# Create useful time features
data["day"] = data["date"].dt.day
data["month"] = data["date"].dt.month
data["day_of_week"] = data["date"].dt.dayofweek

# Features and target
X = data[["day", "month", "day_of_week", "price_per_kg"]]
y = data["demand_kg"]

# Train model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

# Predict next day
last_date = data["date"].max()
next_date = last_date + pd.Timedelta(days=1)

next_data = pd.DataFrame({
    "day": [next_date.day],
    "month": [next_date.month],
    "day_of_week": [next_date.dayofweek],
    "price_per_kg": [20]
})

prediction = model.predict(next_data)[0]

print("\n================================")
print("      FARM DIRECT AI")
print("================================")
print(f"Crop: Tomato")
print(f"Last recorded demand: {data['demand_kg'].iloc[-1]} kg")
print(f"Predicted demand: {prediction:.0f} kg")
print("================================\n")