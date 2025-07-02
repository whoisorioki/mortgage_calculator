import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, HelpCircle, Calculator } from "lucide-react";

interface ResultsViewProps {
  monthlyPayment?: number;
  propertyPrice?: number;
  downPayment?: number;
  loanTerm?: number;
  interestRate?: number;
  onBackToInput?: () => void;
}

const ResultsView = ({
  monthlyPayment = 2271,
  propertyPrice = 500000,
  downPayment = 100000,
  loanTerm = 30,
  interestRate = 5.5,
  onBackToInput = () => {},
}: ResultsViewProps) => {
  // State for adjustable values
  const [adjustedPropertyPrice, setAdjustedPropertyPrice] =
    useState<number>(propertyPrice);
  const [adjustedDownPayment, setAdjustedDownPayment] =
    useState<number>(downPayment);
  const [adjustedInterestRate, setAdjustedInterestRate] =
    useState<number>(interestRate);

  // State for view management
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Calculate payment breakdown
  const loanAmount = adjustedPropertyPrice - adjustedDownPayment;
  const monthlyInterestRate = adjustedInterestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Calculate principal and interest (P&I) payment
  const principalAndInterest =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Estimate taxes and insurance (for demonstration purposes)
  const propertyTax = (adjustedPropertyPrice * 0.012) / 12; // Assuming 1.2% annual property tax
  const insurance = (adjustedPropertyPrice * 0.005) / 12; // Assuming 0.5% annual insurance

  // Calculate total monthly payment
  const calculatedMonthlyPayment =
    principalAndInterest + propertyTax + insurance;

  // Calculate breakdown amounts
  const principalAmount = principalAndInterest * 0.7;
  const interestAmount = principalAndInterest * 0.3;

  // Calculate percentages for pie chart
  const principalPercentage =
    (principalAmount / calculatedMonthlyPayment) * 100;
  const interestPercentage = (interestAmount / calculatedMonthlyPayment) * 100;
  const taxPercentage = (propertyTax / calculatedMonthlyPayment) * 100;
  const insurancePercentage = (insurance / calculatedMonthlyPayment) * 100;

  // Calculate total loan cost and amortization schedule
  const totalInterestPaid =
    principalAndInterest * numberOfPayments - loanAmount;
  const totalLoanCost = loanAmount + totalInterestPaid;

  // Generate amortization schedule
  const generateAmortizationSchedule = () => {
    const schedule = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = principalAndInterest - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      });
    }

    return schedule;
  };

  const amortizationSchedule = generateAmortizationSchedule();

  // Pie chart segments data
  const pieSegments = [
    {
      name: "Principal",
      value: principalAmount,
      percentage: principalPercentage,
      color: "#3b82f6",
    },
    {
      name: "Interest",
      value: interestAmount,
      percentage: interestPercentage,
      color: "#93c5fd",
    },
    {
      name: "Taxes",
      value: propertyTax,
      percentage: taxPercentage,
      color: "#64748b",
    },
    {
      name: "Insurance",
      value: insurance,
      percentage: insurancePercentage,
      color: "#cbd5e1",
    },
  ];

  // Calculate cumulative percentages for pie chart positioning
  let cumulativePercentage = 0;
  const segmentsWithPositions = pieSegments.map((segment) => {
    const startAngle = cumulativePercentage * 3.6; // Convert percentage to degrees
    cumulativePercentage += segment.percentage;
    const endAngle = cumulativePercentage * 3.6;
    return {
      ...segment,
      startAngle,
      endAngle,
    };
  });

  if (showAmortization) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Loan Breakdown
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAmortization(false)}
            className="flex items-center gap-1 text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Results
          </Button>
        </div>

        {/* Loan Breakdown Summary */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Loan Breakdown
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">Principal Loan Amount</span>
              <span className="font-medium">
                $
                {loanAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">Total Interest Paid</span>
              <span className="font-medium">
                $
                {totalInterestPaid.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2 text-sm sm:text-base">
              <span className="font-semibold text-gray-800">
                Total Cost of Loan
              </span>
              <span className="font-bold text-base sm:text-lg">
                $
                {totalLoanCost.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Amortization Schedule */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Amortization Schedule
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 grid grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-700">
              <div>Month</div>
              <div>Year</div>
              <div>Principal</div>
              <div>Interest</div>
              <div>Balance</div>
            </div>
            <div className="max-h-64 sm:max-h-96 overflow-y-auto">
              {amortizationSchedule.map((payment, index) => {
                const year = Math.ceil(payment.month / 12);
                const monthInYear = ((payment.month - 1) % 12) + 1;
                const monthName = new Date(0, monthInYear - 1).toLocaleString(
                  "default",
                  { month: "short" },
                );

                return (
                  <div
                    key={payment.month}
                    className={`grid grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-3 text-xs sm:text-sm border-t ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <div className="font-medium">{payment.month}</div>
                    <div className="font-medium">{year}</div>
                    <div>
                      $
                      {payment.principal.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div>
                      $
                      {payment.interest.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div>
                      $
                      {payment.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Payment Results
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToInput}
          className="flex items-center gap-1 text-blue-600 sm:hidden"
        >
          <ArrowLeft size={16} />
          Back to Input
        </Button>
      </div>

      {/* Monthly Payment Display */}
      <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 text-center">
        <p className="text-sm text-blue-700 mb-1">Your Monthly Payment</p>
        <div className="flex items-center justify-center flex-wrap">
          <span className="text-2xl sm:text-4xl font-bold text-blue-800">
            ${calculatedMonthlyPayment.toFixed(2)}
          </span>
          <span className="text-base sm:text-lg text-blue-600 ml-1">
            /month
          </span>
        </div>
      </div>

      {/* Payment Breakdown Pie Chart */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Monthly Payment Breakdown
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0">
                  <HelpCircle size={16} className="text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Breakdown of your monthly mortgage payment components
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Solid Pie Chart Visualization with Hover */}
        <div className="relative h-48 w-48 sm:h-64 sm:w-64 mx-auto mb-4">
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {segmentsWithPositions.map((segment, index) => {
              const centerX = 100;
              const centerY = 100;
              const radius = 80;

              // Convert angles to radians
              const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180);
              const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180);

              // Calculate path coordinates
              const x1 = centerX + radius * Math.cos(startAngleRad);
              const y1 = centerY + radius * Math.sin(startAngleRad);
              const x2 = centerX + radius * Math.cos(endAngleRad);
              const y2 = centerY + radius * Math.sin(endAngleRad);

              const largeArcFlag = segment.percentage > 50 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z",
              ].join(" ");

              return (
                <TooltipProvider key={segment.name}>
                  <Tooltip open={hoveredSegment === segment.name}>
                    <TooltipTrigger asChild>
                      <path
                        d={pathData}
                        fill={segment.color}
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200 hover:opacity-80"
                        onMouseEnter={() => setHoveredSegment(segment.name)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">{segment.name}</p>
                        <p className="text-sm">${segment.value.toFixed(2)}</p>
                        <p className="text-xs">
                          {segment.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          {pieSegments.map((segment) => (
            <div key={segment.name} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="truncate">
                {segment.name}: ${segment.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs sm:text-sm font-medium text-gray-700">
              Down Payment
            </Label>
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              ${adjustedDownPayment.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[adjustedDownPayment]}
            onValueChange={(value) => setAdjustedDownPayment(value[0])}
            max={adjustedPropertyPrice * 0.5}
            min={adjustedPropertyPrice * 0.05}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Interest Rate Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs sm:text-sm font-medium text-gray-700">
              Interest Rate
            </Label>
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              {adjustedInterestRate.toFixed(2)}%
            </span>
          </div>
          <Slider
            value={[adjustedInterestRate]}
            onValueChange={(value) => setAdjustedInterestRate(value[0])}
            max={10}
            min={2}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onBackToInput}
          variant="outline"
          className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          Start Over
        </Button>
        <Button
          onClick={() => setShowAmortization(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Full Breakdown
        </Button>
      </div>
    </div>
  );
};

export default ResultsView;
