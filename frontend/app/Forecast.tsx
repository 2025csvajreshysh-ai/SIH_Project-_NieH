"use client";

import { useEffect, useState } from "react";

type ForecastData = {
  crop: string;
  current_average_demand: number;
  forecast: number[];
  average_predicted_demand: number;
  demand_level: string;
  recommendation: string;
};

export default function Forecast() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/forecast")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch forecast");
        }
        return response.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setError("AI server is not running");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading AI forecast...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>No forecast available.</p>;
  }

  return (
    <div>
      <h2>AI Demand Forecast</h2>

      <h3>{data.crop}</h3>

      <p>
        Current demand:{" "}
        <strong>{data.current_average_demand} kg/day</strong>
      </p>

      <p>
        Predicted demand:{" "}
        <strong>{data.average_predicted_demand} kg/day</strong>
      </p>

      <p>
        Demand level: <strong>{data.demand_level}</strong>
      </p>

      <p>{data.recommendation}</p>

      <h3>7-Day Forecast</h3>

      <ul>
        {data.forecast.map((demand, index) => (
          <li key={index}>
            Day {index + 1}: {demand} kg
          </li>
        ))}
      </ul>
    </div>
  );
}
