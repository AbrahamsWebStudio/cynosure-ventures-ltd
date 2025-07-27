"use client";

import { useState, useEffect } from "react";

interface Driver {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  eta: number;
  location?: {
    lat: number;
    lng: number;
  };
}

interface RideTrackingProps {
  driver: Driver;
  pickup: string;
  dropoff: string;
  status: "assigned" | "arriving" | "arrived" | "in_progress" | "completed";
  onStatusChange?: (status: string) => void;
}

export default function RideTracking({ driver, pickup, dropoff, status, onStatusChange }: RideTrackingProps) {
  const [currentEta, setCurrentEta] = useState(driver.eta);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      if (currentEta > 0) {
        setCurrentEta(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEta]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "text-blue-600";
      case "arriving": return "text-yellow-600";
      case "arrived": return "text-green-600";
      case "in_progress": return "text-purple-600";
      case "completed": return "text-gray-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned": return "🚗";
      case "arriving": return "📍";
      case "arrived": return "✅";
      case "in_progress": return "🚀";
      case "completed": return "🏁";
      default: return "🚗";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "assigned": return "Driver Assigned";
      case "arriving": return "Driver Arriving";
      case "arrived": return "Driver Arrived";
      case "in_progress": return "On the Way";
      case "completed": return "Trip Completed";
      default: return "Unknown Status";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Ride Status</h2>
        <div className={`flex items-center space-x-2 ${getStatusColor(status)}`}>
          <span className="text-2xl">{getStatusIcon(status)}</span>
          <span className="font-medium">{getStatusText(status)}</span>
        </div>
      </div>

      {/* Driver Info */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {driver.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{driver.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>⭐ {driver.rating}</span>
              <span>{driver.vehicle}</span>
            </div>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            📞 Call
          </button>
        </div>
      </div>

      {/* Trip Progress */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pickup</p>
            <p className="font-medium text-gray-900 dark:text-white">{pickup}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Dropoff</p>
            <p className="font-medium text-gray-900 dark:text-white">{dropoff}</p>
          </div>
        </div>
      </div>

      {/* ETA */}
      {status !== "completed" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Arrival</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentEta} min
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Elapsed Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          📍 Share Location
        </button>
        <button className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          💬 Message
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.min(100, (elapsedTime / (driver.eta * 60)) * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (elapsedTime / (driver.eta * 60)) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
} 