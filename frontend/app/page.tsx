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
    return (
      <div className="rounded-2xl border p-6">
        <p>Loading AI forecast...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border p-6">
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Start the Flask AI server and refresh the page.
        </p>
      </div>
    );
  }

  if (!data) {
    return <p>No forecast available.</p>;
  }

  const level = data.demand_level.toUpperCase();

  const levelClass =
    level === "HIGH"
      ? "bg-red-100 text-red-700"
      : level === "LOW"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700";

  const difference =
    data.average_predicted_demand - data.current_average_demand;

  const percentageChange =
    data.current_average_demand > 0
      ? Math.round(
          (difference / data.current_average_demand) * 100
        )
      : 0;

  return (
    <section className="mx-auto my-8 w-full max-w-5xl rounded-3xl border bg-white p-6 shadow-lg md:p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">
            FARM DIRECT AI
          </p>

          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Demand Forecast
          </h2>

          <p className="mt-1 text-gray-500">
            AI-powered prediction for the next 7 days
          </p>
        </div>

        <div
          className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${levelClass}`}
        >
          {level} DEMAND
        </div>
      </div>

      {/* Main statistics */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Crop
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            🍅 {data.crop}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Current Demand
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.current_average_demand} kg/day
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">
            Predicted Demand
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data.average_predicted_demand} kg/day
          </p>

          <p className="mt-1 text-sm">
            {percentageChange >= 0 ? "+" : ""}
            {percentageChange}% vs current
          </p>
        </div>

      </div>

      {/* Recommendation */}
      <div className="mt-6 rounded-2xl border p-5">
        <p className="text-sm font-semibold text-gray-500">
          AI RECOMMENDATION
        </p>

        <p className="mt-2 text-lg font-semibold text-gray-900">
          💡 {data.recommendation}
        </p>
      </div>

      {/* 7-day forecast */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900">
          7-Day Forecast
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">

          {data.forecast.map((demand, index) => (
            <div
              key={index}
              className="rounded-2xl border p-4 text-center"
            >
              <p className="text-xs font-medium text-gray-500">
                Day {index + 1}
              </p>

              <p className="mt-2 text-lg font-bold text-gray-900">
                {demand}
              </p>

              <p className="text-xs text-gray-500">
                kg
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t pt-4">
        <p className="text-xs text-gray-400">
          Forecast generated using the FarmDirect AI demand prediction model.
        </p>
      </div>

    </section>
  );
}