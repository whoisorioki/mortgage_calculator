import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InputFormProps {
  initialValues?: {
    propertyPrice: number;
    downPayment: number;
    loanTerm: number;
    interestRate: number;
  };
  onInputChange?: (inputs: {
    propertyPrice: number;
    downPayment: number;
    loanTerm: number;
    interestRate: number;
  }) => void;
  onCalculate: (formData: {
    propertyPrice: number;
    downPayment: number;
    loanTerm: number;
    interestRate: number;
  }) => void;
}

const InputForm = ({
  initialValues,
  onInputChange,
  onCalculate = () => { }
}: InputFormProps) => {
  const [propertyPrice, setPropertyPrice] = useState<string>(
    initialValues?.propertyPrice?.toString() || "500000"
  );
  const [downPayment, setDownPayment] = useState<string>(
    initialValues?.downPayment?.toString() || "100000"
  );
  const [loanTerm, setLoanTerm] = useState<number>(
    initialValues?.loanTerm || 30
  );
  const [interestRate, setInterestRate] = useState<string>(
    initialValues?.interestRate?.toString() || "5.5"
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDownPaymentPercentage = () => {
    const price = parseFloat(propertyPrice) || 0;
    const payment = parseFloat(downPayment) || 0;
    if (price === 0) return "0";
    return ((payment / price) * 100).toFixed(1);
  };

  const notifyInputChange = (updates: Partial<{
    propertyPrice: string;
    downPayment: string;
    loanTerm: number;
    interestRate: string;
  }>) => {
    if (onInputChange) {
      const currentValues = {
        propertyPrice: parseFloat(updates.propertyPrice || propertyPrice) || 0,
        downPayment: parseFloat(updates.downPayment || downPayment) || 0,
        loanTerm: updates.loanTerm || loanTerm,
        interestRate: parseFloat(updates.interestRate || interestRate) || 0,
      };
      onInputChange(currentValues);
    }
  };

  const handlePropertyPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPropertyPrice(value);
    notifyInputChange({ propertyPrice: value });
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setDownPayment(value);
    notifyInputChange({ downPayment: value });
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setInterestRate(value);
    notifyInputChange({ interestRate: value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!propertyPrice || parseFloat(propertyPrice) <= 0) {
      newErrors.propertyPrice = "Please enter a valid property price";
    }

    if (!downPayment) {
      newErrors.downPayment = "Please enter a down payment amount";
    } else if (parseFloat(downPayment) > parseFloat(propertyPrice)) {
      newErrors.downPayment = "Down payment cannot exceed property price";
    }

    if (
      !interestRate ||
      parseFloat(interestRate) <= 0 ||
      parseFloat(interestRate) >= 100
    ) {
      newErrors.interestRate =
        "Please enter a valid interest rate between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onCalculate({
        propertyPrice: parseFloat(propertyPrice),
        downPayment: parseFloat(downPayment),
        loanTerm: loanTerm,
        interestRate: parseFloat(interestRate),
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">
        Enter Your Home Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label htmlFor="propertyPrice">Property Price</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The total purchase price of the home you want to buy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {errors.propertyPrice && (
              <span className="text-xs text-red-500">
                {errors.propertyPrice}
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="propertyPrice"
              value={propertyPrice}
              onChange={handlePropertyPriceChange}
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label htmlFor="downPayment">Down Payment</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The amount you'll pay upfront when buying the home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {errors.downPayment && (
              <span className="text-xs text-red-500">{errors.downPayment}</span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="downPayment"
              value={downPayment}
              onChange={handleDownPaymentChange}
              className="pl-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {calculateDownPaymentPercentage()}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label htmlFor="loanTerm">Loan Term</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How many years you'll take to pay back the loan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {loanTerm} years
            </span>
          </div>
          <div className="space-y-3">
            <Slider
              value={[loanTerm]}
              onValueChange={(value) => {
                setLoanTerm(value[0]);
                notifyInputChange({ loanTerm: value[0] });
              }}
              max={40}
              min={10}
              step={1}
              className="w-full"
              data-testid="loan-term-slider"
            />
            {/* Hidden input for test automation */}
            <input
              type="hidden"
              id="loan-term-value"
              value={loanTerm}
              data-testid="loan-term-value"
              readOnly
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10 years</span>
              <span>40 years</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label htmlFor="interestRate">Interest Rate</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The yearly interest rate the lender charges on your loan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {errors.interestRate && (
              <span className="text-xs text-red-500">
                {errors.interestRate}
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="interestRate"
              value={interestRate}
              onChange={handleInterestRateChange}
              className="pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              %
            </span>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Calculate My Monthly Payment
        </Button>
      </form>
    </div>
  );
};

export default InputForm;
