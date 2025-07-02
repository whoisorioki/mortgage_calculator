import React from "react";
import MortgageCalculator from "./MortgageCalculator";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-2 sm:p-4">
      <div className="w-full max-w-7xl">
        <MortgageCalculator />
      </div>
    </div>
  );
}
