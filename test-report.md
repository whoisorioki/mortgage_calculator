# Mortgage Calculator Test Report

**Date**: Mon Jul  7 08:58:06 UTC 2025
**Test Scenarios**: 8 comprehensive scenarios from spreadsheet

## Test Scenarios Covered:

1. **Basic Mortgage**
   - Property: £150,000, Down Payment: £30,000 (20%), Term: 25 years, Rate: 3.5%
   - Expected Monthly P&I: ~£600.38

2. **Large Loan Amount**
   - Property: £500,000, Down Payment: £100,000 (20%), Term: 30 years, Rate: 4.2%
   - Expected Monthly P&I: ~£1,957.01

3. **Shorter Term Loan**
   - Property: £200,000, Down Payment: £40,000 (20%), Term: 15 years, Rate: 3.0%
   - Expected Monthly P&I: ~£1,106.18

4. **High Interest Rate**
   - Property: £120,000, Down Payment: £24,000 (20%), Term: 20 years, Rate: 5.5%
   - Expected Monthly P&I: ~£653.23

5. **Low Loan Amount, Adjustable Rate**
   - Property: £75,000, Down Payment: £15,000 (20%), Term: 10 years, Rate: 2.8%
   - Expected Monthly P&I: ~£576.87

6. **Interest-Only Mortgage**
   - Property: £250,000, Down Payment: £50,000 (20%), Term: 25 years, Rate: 4.0%
   - Expected Monthly P&I: ~£666.67

7. **High Loan-to-Value (LTV) Ratio**
   - Property: £400,000, Down Payment: £50,000 (12.5%), Term: 30 years, Rate: 4.5%
   - Expected Monthly P&I: ~£1,773.40

8. **Low LTV Ratio**
   - Property: £250,000, Down Payment: £150,000 (60%), Term: 20 years, Rate: 3.75%
   - Expected Monthly P&I: ~£591.88

## Test Results:

- Playwright test report generated at: playwright-report/index.html
