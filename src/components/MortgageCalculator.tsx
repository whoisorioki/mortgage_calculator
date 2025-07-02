import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import InputForm from "./InputForm";
import ResultsView from "./ResultsView";

interface MortgageCalculatorProps {
  className?: string;
}

interface MortgageInputs {
  propertyPrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
}

interface MortgageResults {
  monthlyPayment: number;
  principal: number;
  interest: number;
  taxes: number;
  insurance: number;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  className = "",
}) => {
  const [showResults, setShowResults] = useState<boolean>(false);
  const [mortgageInputs, setMortgageInputs] = useState<MortgageInputs>({
    propertyPrice: 500000,
    downPayment: 100000,
    loanTerm: 30,
    interestRate: 5.5,
  });
  const [mortgageResults, setMortgageResults] = useState<MortgageResults>({
    monthlyPayment: 0,
    principal: 0,
    interest: 0,
    taxes: 0,
    insurance: 0,
  });

  const calculateMortgage = (inputs: MortgageInputs) => {
    const loanAmount = inputs.propertyPrice - inputs.downPayment;
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const numberOfPayments = inputs.loanTerm * 12;

    // Calculate monthly payment using the mortgage formula
    const monthlyPayment =
      (loanAmount *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Estimate taxes (1% of property value annually)
    const monthlyTaxes = (inputs.propertyPrice * 0.01) / 12;

    // Estimate insurance (0.5% of property value annually)
    const monthlyInsurance = (inputs.propertyPrice * 0.005) / 12;

    // Calculate principal and interest portions
    const principalAndInterest = monthlyPayment;
    const principal = principalAndInterest * 0.7; // Simplified approximation
    const interest = principalAndInterest * 0.3; // Simplified approximation

    setMortgageResults({
      monthlyPayment: monthlyPayment + monthlyTaxes + monthlyInsurance,
      principal,
      interest,
      taxes: monthlyTaxes,
      insurance: monthlyInsurance,
    });

    setShowResults(true);
  };

  const handleInputChange = (inputs: MortgageInputs) => {
    setMortgageInputs(inputs);
  };

  const handleCalculate = () => {
    calculateMortgage(mortgageInputs);
  };

  const handleBackToInput = () => {
    setShowResults(false);
  };

  const handleResultsAdjustment = (adjustedInputs: MortgageInputs) => {
    setMortgageInputs(adjustedInputs);
    calculateMortgage(adjustedInputs);
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto bg-white ${className}`}>
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
          Mortgage Calculator
        </CardTitle>
        <CardDescription className="text-gray-600">
          Plan your purchase with confidence
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {!showResults ? (
          <InputForm
            initialValues={mortgageInputs}
            onInputChange={handleInputChange}
            onCalculate={handleCalculate}
          />
        ) : (
          <ResultsView
            results={mortgageResults}
            inputs={mortgageInputs}
            onBackToInput={handleBackToInput}
            onAdjustValues={handleResultsAdjustment}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator;
